import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import MainLayout from "../components/layout/MainLayout.vue";
import Home from "../view/Home.vue";
import Category from "../view/category/Category.vue";
import Table from "../view/table/Table.vue";
import Login from "../view/auth/Login.vue";
import { useAuthStore } from "../stores/auth.store";
import Staff from "../view/staff/Staff.vue";
import PaymentType from "../view/paymentType/PaymentType.vue";
import Supplier from "../view/suppliers/Supplier.vue";
import Customer from "../view/customer/Customer.vue";
import Product from "../view/product/Product.vue";
import SellOrder from "../view/sellOrder/SellOrder.vue";
import Purchase from "../view/purchase/Purchase.vue";
import Expense from "../view/expense/Expense.vue";
import SellOrderList from "../view/sellOrder/SellOrderList.vue";
import AllReport from "../view/report/AllReport.vue";
import User from "../view/auth/User.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    component: MainLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "", // default page
        name: "Home",
        component: Home,
      },
      {
        path: "category",
        name: "Category",
        component: Category,
      },
      {
        path: "table",
        name: "Table",
        component: Table,
      },
      {
        path: "staff",
        name: "Staff",
        component: Staff,
      },
      {
        path: "paymentType",
        name: "PaymentType",
        component: PaymentType,
      },

      {
        path: "customer",
        name: "Customer",
        component: Customer,
      },
      {
        path: "supplier",
        name: "Supplier",
        component: Supplier,
      },
      {
        path: "product",
        name: "Product",
        component: Product,
      },
      {
        path: "sell/:id?",
        name: "Sell",
        component: SellOrder,
      },
      {
        path: "sellList",
        name: "SellList",
        component: SellOrderList,
      },

      {
        path: "purchase",
        name: "Purchase",
        component: Purchase,
      },

      {
        path: "expense",
        name: "Expense",
        component: Expense,
      },
      {
        path: "user",
        name: "User",
        component: User,
      },
      {
        path: "report",
        name: "Report",
        component: AllReport,
      },
    ],
  },
  //no path
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// route guard or protection route
// router.beforeEach((to, from, next) => {
//   const auth = useAuthStore(); // get store

//   if (to.meta.requiresAuth && !auth.isAuthenticated) {
//     next("/login"); // redirect to login
//   } else if (to.path === "/login" && auth.isAuthenticated) {
//     next("/"); // redirect to home
//   } else {
//     next(); // allow navigation
//   }
// });


// route guard or protection route
router.beforeEach((to, from, next) => {
  const auth = useAuthStore(); 
  const user = auth.getUser;
  const role = user?.role?.toLowerCase();

  // Not logged in
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next("/login"); 
  }

  //  Already logged in, prevent login page
  if (to.path === "/login" && auth.isAuthenticated) {
    return next("/"); 
  }

  //  Kitchen restriction
  if (role === "kitchen") {
    const allowedRoutes = ["Home", "Table", "SellList"];

    if (!allowedRoutes.includes(to.name as string)) {
      return next({ name: "Home" });
    }

    return next();
  }

  // Not admin → block User page
  if (role !== "admin" && to.name === "User") {
    return next({ name: "Home" }); // or "Unauthorized"
  }

  // Allow everything else
  return next();
});


export default router;
