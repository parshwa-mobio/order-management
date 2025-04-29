import { Fragment, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import {
  X,
  PackageCheck,
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart,
  Settings,
  User,
  Users,
  FileText,
  Boxes,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { user } = useAuth();

  const navigation = useMemo(() => {
    const baseMenuItems = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Orders", href: "/orders", icon: ShoppingCart },
    ];

    // Admin-specific menu items
    if (user?.role === "admin") {
      return [
        ...baseMenuItems,
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Products", href: "/products", icon: Package },
        { name: "Categories", href: "/categories", icon: Boxes },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Profile", href: "/profile", icon: User },
      ];
    }

    // Distributor menu items
    if (user?.role === "distributor") {
      return [
        ...baseMenuItems,
        { name: "Products", href: "/products", icon: Package },
        { name: "Reports", href: "/reports", icon: BarChart },
        { name: "Contracts", href: "/contracts", icon: FileText },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Profile", href: "/profile", icon: User },
      ];
    }

    // Dealer menu items
    if (user?.role === "dealer") {
      return [
        ...baseMenuItems,
        { name: "Products", href: "/products", icon: Package },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Profile", href: "/profile", icon: User },
      ];
    }

    // Sales team menu items
    if (user?.role === "sales") {
      return [
        ...baseMenuItems,
        { name: "Products", href: "/products", icon: Package },
        { name: "Reports", href: "/reports", icon: BarChart },
        { name: "Contracts", href: "/contracts", icon: FileText },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Profile", href: "/profile", icon: User },
      ];
    }

    // Export team menu items
    if (user?.role === "exportTeam") {
      return [
        ...baseMenuItems,
        { name: "Products", href: "/products", icon: Package },
        { name: "Reports", href: "/reports", icon: BarChart },
        { name: "Contracts", href: "/contracts", icon: FileText },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Profile", href: "/profile", icon: User },
      ];
    }

    return baseMenuItems;
  }, [user]);

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>

              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <PackageCheck className="h-8 w-auto text-blue-600" />
                  <span className="ml-2 text-xl font-semibold text-blue-600">
                    OrderPortal
                  </span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        } group flex items-center px-2 py-2 text-base font-medium rounded-md`
                      }
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className="mr-4 flex-shrink-0 h-6 w-6"
                        aria-hidden="true"
                      />
                      {item.name}
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex-shrink-0 group block">
                  <div className="flex items-center">
                    <div>
                      <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                        <span className="text-sm font-medium leading-none text-blue-700">
                          {user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                        {user?.role
                          ? user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>

          <div className="flex-shrink-0 w-14">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <PackageCheck className="h-8 w-auto text-blue-600" />
                <span className="ml-2 text-xl font-semibold text-blue-600">
                  OrderPortal
                </span>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`
                    }
                  >
                    <item.icon
                      className="mr-3 flex-shrink-0 h-6 w-6"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-blue-100">
                      <span className="text-sm font-medium leading-none text-blue-700">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                      {user?.role
                        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
