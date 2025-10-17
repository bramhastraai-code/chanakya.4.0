"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlotType = exports.PropertyCategory = exports.OfferVariant = exports.TagVariant = exports.BHKConfiguration = exports.PropertyPurpose = exports.PGAvailableFor = exports.PropertyType = exports.FurnishingStatus = exports.PropertyLabel = exports.PropertyStatus = exports.FacingDirection = void 0;
var FacingDirection;
(function (FacingDirection) {
    FacingDirection["NORTH"] = "North";
    FacingDirection["SOUTH"] = "South";
    FacingDirection["EAST"] = "East";
    FacingDirection["WEST"] = "West";
    FacingDirection["NORTH_EAST"] = "North-East";
    FacingDirection["NORTH_WEST"] = "North-West";
    FacingDirection["SOUTH_EAST"] = "South-East";
    FacingDirection["SOUTH_WEST"] = "South-West";
})(FacingDirection || (exports.FacingDirection = FacingDirection = {}));
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["READY_TO_MOVE"] = "Ready to move";
    PropertyStatus["UNDER_CONSTRUCTION"] = "Under Construction";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
var PropertyLabel;
(function (PropertyLabel) {
    PropertyLabel["FOR_SALE"] = "For Sale";
    PropertyLabel["FOR_RENT"] = "For Rent";
    PropertyLabel["SOLD"] = "Sold";
    PropertyLabel["RENTED"] = "Rented";
})(PropertyLabel || (exports.PropertyLabel = PropertyLabel = {}));
var FurnishingStatus;
(function (FurnishingStatus) {
    FurnishingStatus["FULLY_FURNISHED"] = "Fully Furnished";
    FurnishingStatus["SEMI_FURNISHED"] = "Semi Furnished";
    FurnishingStatus["UNFURNISHED"] = "Unfurnished";
})(FurnishingStatus || (exports.FurnishingStatus = FurnishingStatus = {}));
var PropertyType;
(function (PropertyType) {
    PropertyType["RESIDENTIAL"] = "Residential";
    PropertyType["COMMERCIAL"] = "Commercial";
    PropertyType["INDUSTRIAL"] = "Industrial";
    PropertyType["FARM_LAND"] = "Farm Land";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
var PGAvailableFor;
(function (PGAvailableFor) {
    PGAvailableFor["MALE"] = "Male";
    PGAvailableFor["FEMALE"] = "Female";
    PGAvailableFor["BOTH"] = "Both";
    PGAvailableFor["FAMILY"] = "Family";
})(PGAvailableFor || (exports.PGAvailableFor = PGAvailableFor = {}));
var PropertyPurpose;
(function (PropertyPurpose) {
    PropertyPurpose["SALE"] = "Sale";
    PropertyPurpose["RENT"] = "Rent";
    PropertyPurpose["LEASE"] = "Lease";
    PropertyPurpose["PURCHASE"] = "Purchase";
})(PropertyPurpose || (exports.PropertyPurpose = PropertyPurpose = {}));
var BHKConfiguration;
(function (BHKConfiguration) {
    BHKConfiguration["STUDIO"] = "studio";
    BHKConfiguration["ONE_BHK"] = "1bhk";
    BHKConfiguration["ONE_POINT_FIVE_BHK"] = "1.5bhk";
    BHKConfiguration["TWO_BHK"] = "2bhk";
    BHKConfiguration["TWO_POINT_FIVE_BHK"] = "2.5bhk";
    BHKConfiguration["THREE_BHK"] = "3bhk";
    BHKConfiguration["THREE_POINT_FIVE_BHK"] = "3.5bhk";
    BHKConfiguration["FOUR_BHK"] = "4bhk";
    BHKConfiguration["FOUR_POINT_FIVE_BHK"] = "4.5bhk";
    BHKConfiguration["FIVE_BHK"] = "5bhk";
    BHKConfiguration["SIX_BHK"] = "6bhk";
    BHKConfiguration["VILLA"] = "villa";
})(BHKConfiguration || (exports.BHKConfiguration = BHKConfiguration = {}));
var TagVariant;
(function (TagVariant) {
    TagVariant["DEFAULT"] = "default";
    TagVariant["WARNING"] = "warning";
    TagVariant["ALERT"] = "alert";
    TagVariant["FEATURE"] = "feature";
    TagVariant["SUCCESS"] = "success";
    TagVariant["CUSTOM"] = "custom";
})(TagVariant || (exports.TagVariant = TagVariant = {}));
var OfferVariant;
(function (OfferVariant) {
    OfferVariant["DISCOUNT"] = "discount";
    OfferVariant["LIMITED_TIME"] = "limited_time";
    OfferVariant["EXCLUSIVE"] = "exclusive";
    OfferVariant["CASHBACK"] = "cashback";
    OfferVariant["FINANCING"] = "financing";
    OfferVariant["BUNDLE"] = "bundle";
    OfferVariant["PRE_SALE"] = "pre_sale";
    OfferVariant["PROMO"] = "promo";
    OfferVariant["REFERRAL"] = "referral";
    OfferVariant["CUSTOM"] = "custom";
})(OfferVariant || (exports.OfferVariant = OfferVariant = {}));
var PropertyCategory;
(function (PropertyCategory) {
    PropertyCategory["HOUSE"] = "House";
    PropertyCategory["SHOP"] = "Shop";
    PropertyCategory["PLOT"] = "Plot";
    PropertyCategory["OFFICE"] = "Office";
    PropertyCategory["FLAT"] = "Flat";
    PropertyCategory["COMPLEX"] = "Complex";
    PropertyCategory["WORKING_SPACE"] = "Working Space";
    PropertyCategory["WAREHOUSE"] = "Warehouse";
    PropertyCategory["LAND"] = "Land";
    PropertyCategory["APARTMENT"] = "Apartment";
    PropertyCategory["VILLA"] = "Villa";
    PropertyCategory["COTTAGE"] = "Cottage";
    PropertyCategory["GARAGE"] = "Garage";
    PropertyCategory["STUDIO"] = "Studio";
    PropertyCategory["BUNGALOW"] = "Bungalow";
    PropertyCategory["LOFT"] = "Loft";
    PropertyCategory["PENTHOUSE"] = "Penthouse";
    PropertyCategory["OTHER"] = "Other";
})(PropertyCategory || (exports.PropertyCategory = PropertyCategory = {}));
var PlotType;
(function (PlotType) {
    PlotType["GATED_COMMUNITY"] = "Gated Community";
    PlotType["OPEN"] = "Open";
    PlotType["RESIDENTIAL"] = "Residential";
    PlotType["COMMERCIAL"] = "Commercial";
    PlotType["INDUSTRIAL"] = "Industrial";
    PlotType["AGRICULTURAL"] = "Agricultural";
    PlotType["MIXED_USE"] = "Mixed Use";
    PlotType["RECREATIONAL"] = "Recreational";
    PlotType["INSTITUTIONAL"] = "Institutional";
    PlotType["VACANT"] = "Vacant";
    PlotType["OTHER"] = "Other";
})(PlotType || (exports.PlotType = PlotType = {}));
//# sourceMappingURL=property.enum.js.map