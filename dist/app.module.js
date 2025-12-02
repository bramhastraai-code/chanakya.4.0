"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const nestjs_razorpay_1 = require("nestjs-razorpay");
const property_module_1 = require("./property/property.module");
const project_module_1 = require("./project/project.module");
const amenity_module_1 = require("./amenity/amenity.module");
const inquiry_module_1 = require("./inquiry/inquiry.module");
const platform_express_1 = require("@nestjs/platform-express");
const builder_module_1 = require("./builder/builder.module");
const search_filter_module_1 = require("./search-filter/search-filter.module");
const s3_module_1 = require("./s3/s3.module");
const websocket_module_1 = require("./websocket/websocket.module");
const schedule_1 = require("@nestjs/schedule");
const firebase_module_1 = require("./firebase/firebase.module");
const notification_module_1 = require("./notification/notification.module");
const core_module_1 = require("./core/core.module");
const agent_profile_module_1 = require("./profiles/agent/agent-profile.module");
const builder_profile_module_1 = require("./profiles/builder/builder-profile.module");
const customer_profile_module_1 = require("./profiles/customer/customer-profile.module");
const super_admin_profile_module_1 = require("./profiles/super-admin/super-admin-profile.module");
const lead_module_1 = require("./lead/lead.module");
const requirement_module_1 = require("./requirement/requirement.module");
const bounty_module_1 = require("./bounty/bounty.module");
const wallet_module_1 = require("./wallet/wallet.module");
const kyc_module_1 = require("./kyc/kyc.module");
const ai_module_1 = require("./ai/ai.module");
const website_module_1 = require("./website/website.module");
const subscription_module_1 = require("./subscription/subscription.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const agent_module_1 = require("./agent/agent.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_razorpay_1.RazorpayModule.forRoot({
                key_id: 'rzp_live_2FhwIdAriDpU2J',
                key_secret: 'GjfwZCuhU933hSd4Eh1QX5da',
            }),
            platform_express_1.MulterModule.register({
                dest: './upload',
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URL'),
                }),
            }),
            core_module_1.CoreModule,
            agent_profile_module_1.AgentProfileModule,
            agent_module_1.AgentModule,
            builder_profile_module_1.BuilderProfileModule,
            builder_module_1.BuilderModule,
            customer_profile_module_1.UserProfileModule,
            super_admin_profile_module_1.SuperAdminProfileModule,
            lead_module_1.LeadModule,
            requirement_module_1.RequirementModule,
            bounty_module_1.BountyModule,
            wallet_module_1.WalletModule,
            kyc_module_1.KycModule,
            subscription_module_1.SubscriptionModule,
            dashboard_module_1.DashboardModule,
            property_module_1.PropertyModule,
            project_module_1.ProjectModule,
            amenity_module_1.AmenityModule,
            inquiry_module_1.InquiryModule,
            search_filter_module_1.SearchFilterModule,
            s3_module_1.S3Module,
            websocket_module_1.WebsocketModule,
            schedule_1.ScheduleModule.forRoot(),
            firebase_module_1.FirebaseModule,
            notification_module_1.NotificationModule,
            ai_module_1.AiModule,
            website_module_1.WebsiteModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map