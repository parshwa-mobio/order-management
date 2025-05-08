const rolePermissions = {
  admin: [
    "order.create",
    "order.view.all",
    "order.manage.all",
    "stock.view.all",
    "stock.manage.all",
    "user.manage",
    "reports.access",
    "system.configure",
  ],
  distributor: [
    "order.create",
    "order.view.own",
    "order.manage.own",
    "stock.view.assigned",
  ],
  dealer: ["order.create", "order.view.own", "stock.view.allocated"],
  sales: [
    "order.view.all",
    "order.manage.assigned",
    "reports.access",
    "stock.alerts",
  ],
  exportTeam: [
    "order.view.all",
    "order.manage.international",
    "logistics.coordinate",
  ],
};

export const permissionUtils = {
  hasPermission(userRole, permission) {
    return rolePermissions[userRole]?.includes(permission) || false;
  },
  getRolePermissions(role) {
    return rolePermissions[role] || [];
  }
};