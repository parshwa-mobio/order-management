import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { XCircle, FileSpreadsheet } from "lucide-react";

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
  const { data: session } = useSession();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          toast.error("Failed to fetch products");
        }
      } catch (err) {
        toast.error("Error loading products");
      }
    };
    fetchProducts();
  }, []);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    parseFile(uploadedFile);
  };

  const handleConfirmOrder = async () => {
    if (!orderSummary) return;
    setLoading(true);

    try {
      const response = await fetch("/api/orders/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any)?.accessToken}`,
        },
        body: JSON.stringify({ items: orderSummary.items }),
      });

      if (!response.ok) throw new Error("Order creation failed");
      toast.success("Bulk order created successfully");
      router.push("/orders");
    } catch (error) {
      toast.error("Failed to confirm order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bulk Upload Orders</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Upload File</h2>
          <p className="text-sm text-gray-600 mb-4">
            CSV or Excel with columns: sku, quantity
          </p>
          <label className="flex items-center gap-3 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700 cursor-pointer hover:bg-gray-100">
            <FileSpreadsheet className="w-5 h-5" />
            Select File
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {file && <p className="text-sm text-gray-500 mt-2">{file.name}</p>}
        </div>

        {validationErrors.length > 0 && (
          <div className="mt-4">
            <h3 className="text-red-600 font-semibold mb-2">
              Validation Errors
            </h3>
            <ul className="space-y-1 text-sm">
              {validationErrors.map((error, idx) => (
                <li key={idx} className="flex items-center text-red-600">
                  <XCircle className="h-4 w-4 mr-2" />
                  Row {error.row}: {error.message} (SKU: {error.sku})
                </li>
              ))}
            </ul>
          </div>
        )}

        {orderSummary && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["SKU", "Name", "Quantity", "Price", "Total"].map(
                      (head, idx) => (
                        <th
                          key={idx}
                          className="px-6 py-3 text-left font-medium text-gray-500 uppercase"
                        >
                          {head}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {orderSummary.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4">{item.sku}</td>
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.quantity}</td>
                      <td className="px-6 py-4">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={4}
                      className="text-right px-6 py-3 font-semibold"
                    >
                      Total Amount:
                    </td>
                    <td className="px-6 py-3 font-semibold">
                      ${orderSummary.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Confirm Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;
