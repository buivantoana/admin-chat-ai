import { Navigate, Route, Routes } from "react-router-dom";
// Layout




import { DashboardPage } from "../pages/DashboardPage";
import { MessageManagementController } from "../pages/message-management/MessageManagementController";
import { ChatBotController } from "../pages/chatbot/ChatBotController";
import { OverViewController } from "../pages/chatbot/OverViewController";
import { DataTrainingController } from "../pages/chatbot/DataTrainingController";
import { IntergrationController } from "../pages/settings/IntergrationController";
import StaffController from "../pages/settings/StaffController";
import { ProductController } from "../pages/chatbot/ProductController";
import BranchController from "../pages/chatbot/BranchController";
import ChatController from "../pages/chatbot/ChatController";
import { LoginPage } from "../pages/authentication/LoginPage"
import Layout from "../layouts/Layout";
import { useEffect, useState } from "react";

const isAuthenticated = () => {
    return localStorage.getItem("token");
};

const PrivateRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const AppRoutes = () => {

    return (
        <>
            <Routes>
                {/* Login không có Layout */}
                <Route path="/login" element={<LoginPage />} />

                {/* Các trang cần đăng nhập, bọc trong Layout */}
                <Route path="/" element={<PrivateRoute element={<Layout />} />}>
                    {/* <Route index element={<DashboardPage />} /> */}
                    <Route index path="message-management/bot/:id" element={<MessageManagementController />} />
                    <Route path="chatbot-training" element={<ChatBotController />} />
                    <Route path="overview/:id" element={<OverViewController />} />
                    <Route path="training-data" element={<DataTrainingController />} />
                    <Route path="product" element={<ProductController />} />
                    <Route path="branch" element={<BranchController />} />
                    <Route path="chat" element={<ChatController />} />
                    <Route path="settings/integrations" element={<IntergrationController />} />
                    <Route path="settings/staff" element={<StaffController />} />
                </Route>

                {/* Mặc định điều hướng nếu không khớp với bất kỳ route nào */}
                <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} replace />} />
            </Routes>


        </>
    )
}
export default AppRoutes;