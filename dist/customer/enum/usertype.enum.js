"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokerType = exports.VerificationStatus = exports.LeadStatus = exports.UserStatus = exports.UserType = void 0;
var UserType;
(function (UserType) {
    UserType["USER"] = "User";
    UserType["AGENT"] = "Agent";
    UserType["BUILDER"] = "Builder";
    UserType["ALL"] = "All";
})(UserType || (exports.UserType = UserType = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["defailt"] = "";
    UserStatus["ALL"] = "all";
    UserStatus["ACTIVE"] = "active";
    UserStatus["IN_ACTIVE"] = "inactive";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["NEW"] = "new";
    LeadStatus["QUALIFIED"] = "qualified";
    LeadStatus["CONFIRMED"] = "confirmed";
    LeadStatus["CONTACTED"] = "contacted";
    LeadStatus["CALL_LATER"] = "call later";
})(LeadStatus || (exports.LeadStatus = LeadStatus = {}));
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["PENDING"] = "pending";
    VerificationStatus["VERIFIED"] = "verified";
    VerificationStatus["REJECTED"] = "rejected";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
var BrokerType;
(function (BrokerType) {
    BrokerType["INDIVIDUAL"] = "individual";
    BrokerType["AGENCY"] = "agency";
})(BrokerType || (exports.BrokerType = BrokerType = {}));
//# sourceMappingURL=usertype.enum.js.map