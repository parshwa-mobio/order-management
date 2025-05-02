import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { BulkUploadForm } from "../../components/orders/BulkUploadForm";

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  moq: number;
}

interface ValidationError {
  row: number;
  sku: string;
  message: string;
}

interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderSummary {
  totalItems: number;
  totalAmount: number;
  items: OrderItem[];
}

const BulkUpload = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  useEffect(() => {
    const handleError = (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        handleError(err);
      }
    };
    fetchProducts();
  }, []);

  const validateRows = (rows: any[]) => {
    const errors: ValidationError[] = [];
    const validItems: OrderItem[] = [];

    rows.forEach((row, index) => {
      const sku = row.sku?.trim();
      const quantity = parseInt(row.quantity);
      const product = products.find((p) => p.sku === sku);

      if (!sku || !product) {
        errors.push({
          row: index + 1,
          sku: sku || "N/A",
          message: "Invalid SKU",
        });
        return;
      }

      if (isNaN(quantity) || quantity < 1) {
        errors.push({ row: index + 1, sku, message: "Invalid quantity" });
        return;
      }

      if (quantity < product.moq) {
        errors.push({
          row: index + 1,
          sku,
          message: `Below MOQ (${product.moq})`,
        });
        return;
      }

      validItems.push({
        sku,
        name: product.name,
        quantity,
        price: product.price,
        total: product.price * quantity,
      });
    });

    setValidationErrors(errors);
    if (validItems.length > 0) {
      setOrderSummary({
        totalItems: validItems.length,
        totalAmount: validItems.reduce((sum, item) => sum + item.total, 0),
        items: validItems,
      });
    } else {
      setOrderSummary(null);
    }
  };

  const parseFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => validateRows(results.data),
        error: () => toast.error("Failed to parse CSV file"),
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        validateRows(jsonData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("Unsupported file format. Use CSV or Excel.");
    }
  };

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    parseFile(uploadedFile);
  };

  const handleConfirmOrder = async () => {
    if (!orderSummary) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/orders/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: orderSummary.items }),
      });

      if (!response.ok) throw new Error("Order creation failed");
      toast.success("Bulk order created successfully");
      navigate("/orders");
    } catch (error) {
      toast.error("Failed to confirm order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BulkUploadForm
      onFileUpload={handleFileUpload}
      onConfirmOrder={handleConfirmOrder}
      validationErrors={validationErrors}
      orderSummary={orderSummary}
      loading={loading}
      file={file}
    />
  );
};

export default BulkUpload;
