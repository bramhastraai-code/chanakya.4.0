export enum FacingDirection {
  NORTH = 'North',
  SOUTH = 'South',
  EAST = 'East',
  WEST = 'West',
  NORTH_EAST = 'North-East',
  NORTH_WEST = 'North-West',
  SOUTH_EAST = 'South-East',
  SOUTH_WEST = 'South-West',
}

export enum PropertyStatus {
  READY_TO_MOVE = 'Ready to move',
  UNDER_CONSTRUCTION = 'Under Construction',
}

export enum PropertyLabel {
  FOR_SALE = 'For Sale',
  FOR_RENT = 'For Rent',
  SOLD = 'Sold',
  RENTED = 'Rented',
}

export enum FurnishingStatus {
  FULLY_FURNISHED = 'Fully Furnished',
  SEMI_FURNISHED = 'Semi Furnished',
  UNFURNISHED = 'Unfurnished',
}

export enum PropertyType {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
  INDUSTRIAL = 'Industrial',
  FARM_LAND = 'Farm Land',
}

export enum PGAvailableFor {
  MALE = 'Male',
  FEMALE = 'Female',
  BOTH = 'Both',
  FAMILY = 'Family',
}

export enum PropertyPurpose {
  SALE = 'Sale',
  RENT = 'Rent',
  LEASE = 'Lease',
  PURCHASE = 'Purchase',
}

export enum BHKConfiguration {
  STUDIO = 'studio',
  ONE_BHK = '1bhk',
  ONE_POINT_FIVE_BHK = '1.5bhk',
  TWO_BHK = '2bhk',
  TWO_POINT_FIVE_BHK = '2.5bhk',
  THREE_BHK = '3bhk',
  THREE_POINT_FIVE_BHK = '3.5bhk',
  FOUR_BHK = '4bhk',
  FOUR_POINT_FIVE_BHK = '4.5bhk',
  FIVE_BHK = '5bhk',
  SIX_BHK = '6bhk',
  VILLA = 'villa',
}
export enum TagVariant {
  DEFAULT = 'default',
  WARNING = 'warning',
  ALERT = 'alert',
  FEATURE = 'feature',
  SUCCESS = 'success',
  CUSTOM = 'custom',
}

export enum OfferVariant {
  DISCOUNT = 'discount',
  LIMITED_TIME = 'limited_time',
  EXCLUSIVE = 'exclusive',
  CASHBACK = 'cashback',
  FINANCING = 'financing',
  BUNDLE = 'bundle',
  PRE_SALE = 'pre_sale',
  PROMO = 'promo',
  REFERRAL = 'referral',
  CUSTOM = 'custom',
}

export enum PropertyCategory {
  HOUSE = 'House',
  SHOP = 'Shop',
  PLOT = 'Plot',
  OFFICE = 'Office',
  FLAT = 'Flat',
  COMPLEX = 'Complex',
  WORKING_SPACE = 'Working Space',
  WAREHOUSE = 'Warehouse',
  LAND = 'Land',
  APARTMENT = 'Apartment', // Added category
  VILLA = 'Villa', // Added category
  COTTAGE = 'Cottage', // Added category
  GARAGE = 'Garage', // Added category
  STUDIO = 'Studio', // Added category
  BUNGALOW = 'Bungalow', // Added category
  LOFT = 'Loft', // Added category
  PENTHOUSE = 'Penthouse', // Added category
  OTHER = 'Other',
}
export enum PlotType {
  GATED_COMMUNITY = 'Gated Community',
  OPEN = 'Open',
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
  INDUSTRIAL = 'Industrial',
  AGRICULTURAL = 'Agricultural',
  MIXED_USE = 'Mixed Use',
  RECREATIONAL = 'Recreational',
  INSTITUTIONAL = 'Institutional',
  VACANT = 'Vacant',
  OTHER = 'Other',
}
