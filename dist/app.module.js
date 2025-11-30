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
const user_module_1 = require("./user/user.module");
const role_module_1 = require("./role/role.module");
const property_module_1 = require("./property/property.module");
const project_module_1 = require("./project/project.module");
const banner_module_1 = require("./banner/banner.module");
const amenity_module_1 = require("./amenity/amenity.module");
const saved_module_1 = require("./saved/saved.module");
const inquiry_module_1 = require("./inquiry/inquiry.module");
const blog_module_1 = require("./blog/blog.module");
const customer_module_1 = require("./customer/customer.module");
const platform_express_1 = require("@nestjs/platform-express");
const builder_module_1 = require("./builder/builder.module");
const search_filter_module_1 = require("./search-filter/search-filter.module");
const s3_module_1 = require("./s3/s3.module");
const order_module_1 = require("./order/order.module");
const plan_module_1 = require("./plan/plan.module");
const short_video_module_1 = require("./short-video/short-video.module");
const agent_inquiry_module_1 = require("./agent-inquiry/agent-inquiry.module");
const websocket_module_1 = require("./websocket/websocket.module");
const schedule_1 = require("@nestjs/schedule");
const firebase_module_1 = require("./firebase/firebase.module");
const user_behavior_module_1 = require("./user-behavior/user-behavior.module");
const video_module_1 = require("./video/video.module");
const agent_module_1 = require("./agent/agent.module");
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
            builder_profile_module_1.BuilderProfileModule,
            customer_profile_module_1.UserProfileModule,
            super_admin_profile_module_1.SuperAdminProfileModule,
            lead_module_1.LeadModule,
            requirement_module_1.RequirementModule,
            bounty_module_1.BountyModule,
            wallet_module_1.WalletModule,
            kyc_module_1.KycModule,
            ai_module_1.AiModule,
            website_module_1.WebsiteModule,
            subscription_module_1.SubscriptionModule,
            dashboard_module_1.DashboardModule,
            user_module_1.UserModule,
            role_module_1.RoleModule,
            property_module_1.PropertyModule,
            project_module_1.ProjectModule,
            banner_module_1.BannerModule,
            amenity_module_1.AmenityModule,
            saved_module_1.SavedModule,
            inquiry_module_1.InquiryModule,
            blog_module_1.BlogModule,
            customer_module_1.CustomerModule,
            builder_module_1.BuilderModule,
            search_filter_module_1.SearchFilterModule,
            s3_module_1.S3Module,
            order_module_1.OrderModule,
            plan_module_1.PlanModule,
            short_video_module_1.ShortVideoModule,
            agent_inquiry_module_1.AgentInquiryModule,
            websocket_module_1.WebsocketModule,
            schedule_1.ScheduleModule.forRoot(),
            firebase_module_1.FirebaseModule,
            user_behavior_module_1.UserBehaviorModule,
            video_module_1.VideoModule,
            agent_module_1.AgentModule,
            notification_module_1.NotificationModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map