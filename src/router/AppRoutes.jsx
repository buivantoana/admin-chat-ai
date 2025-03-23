import { Route, Routes } from "react-router-dom";
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




const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/message-management" element={<MessageManagementController />} />
            <Route path="/chatbot-training" element={<ChatBotController />} />
            <Route path="/overview" element={<OverViewController />} />
            <Route path="/training-data" element={<DataTrainingController />} />
            <Route path="/product" element={<ProductController />} />
            <Route path="/branch" element={<BranchController />} />
            <Route path="/chat" element={<ChatController />} />
            <Route path="/settings/integrations" element={<IntergrationController />} />
            <Route path="/settings/staff" element={<StaffController />} />
        </Routes>
    )
}
export default AppRoutes;