# Offers System Implementation

## Overview
A comprehensive offers/incentives management system where builders create special offers for their projects, and agents can view offers only for projects they're associated with. Similar to the bounty system but focused on commission boosts, bonuses, and special incentives.

## Features

### Offer Types
- **COMMISSION_BOOST**: Extra commission percentage on sales
- **CLOSING_BONUS**: Bonus for closing deals
- **EARLY_BIRD**: Special incentive for early sales
- **BULK_SALE**: Rewards for selling multiple units
- **SPECIAL_INCENTIVE**: Custom incentives

### Offer Status
- **ACTIVE**: Currently available
- **PAUSED**: Temporarily disabled
- **CLOSED**: Manually closed by builder
- **EXPIRED**: Past validUntil date

## API Endpoints

### Builder Endpoints (`/builder/offers`)

#### Create Offer
**POST** `/builder/offers`
- **Role**: BUILDER
- **Body**:
```json
{
  "title": "10% Commission Boost on Early Sales",
  "description": "Get 10% extra commission on all sales closed in the first month",
  "incentiveAmount": 50000,
  "type": "commission_boost",
  "termsAndConditions": [
    "Valid for first 10 units only",
    "Payment within 30 days of booking"
  ],
  "minUnitsToSell": 5,
  "commissionPercentage": 2.5,
  "validFrom": "2025-01-01T00:00:00.000Z",
  "validUntil": "2025-12-31T23:59:59.000Z",
  "projectId": "507f1f77bcf86cd799439011"
}
```

#### Get Builder's Offers
**GET** `/builder/offers?projectId=&status=&page=1&limit=20`
- **Role**: BUILDER
- **Query Params**:
  - `projectId` (optional): Filter by specific project
  - `status` (optional): Filter by status
  - `page` (optional): Page number
  - `limit` (optional): Items per page
- **Returns**: Paginated list of offers for builder's projects

#### Get Offer Details
**GET** `/builder/offers/:id`
- **Role**: BUILDER
- **Returns**: Full offer details with project and creator info

#### Update Offer
**PATCH** `/builder/offers/:id`
- **Role**: BUILDER (only own offers)
- **Body**: Partial offer update
```json
{
  "status": "paused",
  "incentiveAmount": 75000,
  "validUntil": "2026-01-31T23:59:59.000Z"
}
```

#### Delete Offer
**DELETE** `/builder/offers/:id`
- **Role**: BUILDER (only own offers)
- **Returns**: Confirmation message

#### Get Offers by Project
**GET** `/builder/offers/project/:projectId?status=&page=1&limit=20`
- **Role**: BUILDER
- **Returns**: All offers for specific project

---

### Agent Endpoints (`/agent/offers`)

#### Get Associated Project Offers
**GET** `/agent/offers?status=&page=1&limit=20`
- **Role**: AGENT
- **Query Params**:
  - `status` (optional): Filter by status
  - `page` (optional): Page number
  - `limit` (optional): Items per page
- **Returns**: Offers only for projects agent is associated with
- **Visibility**: Agent sees offers ONLY for projects where they have builder-agent association

#### Get Offer Details
**GET** `/agent/offers/:id`
- **Role**: AGENT
- **Returns**: Offer details if agent has access to the project
- **Access Control**: Throws 403 if agent not associated with project

---

### Admin Endpoints (`/admin/offers`)

#### Create Offer (Admin)
**POST** `/admin/offers`
- **Role**: ADMIN, SUPER_ADMIN
- **Body**: Same as builder create
- **Note**: Admin can create offers for any project

#### Get All Offers (Admin)
**GET** `/admin/offers?projectId=&builderId=&status=&page=1&limit=20`
- **Role**: ADMIN, SUPER_ADMIN
- **Query Params**:
  - `projectId` (optional): Filter by project
  - `builderId` (optional): Filter by builder
  - `status` (optional): Filter by status
  - `page`, `limit`: Pagination
- **Returns**: All offers in system

#### Get Offer Details (Admin)
**GET** `/admin/offers/:id`
- **Role**: ADMIN, SUPER_ADMIN
- **Returns**: Full offer details

#### Update Offer (Admin)
**PATCH** `/admin/offers/:id`
- **Role**: ADMIN, SUPER_ADMIN
- **Body**: Partial offer update

#### Delete Offer (Admin)
**DELETE** `/admin/offers/:id`
- **Role**: ADMIN, SUPER_ADMIN

#### Update Expired Offers
**POST** `/admin/offers/update-expired`
- **Role**: ADMIN, SUPER_ADMIN
- **Action**: Automatically updates all offers past validUntil to EXPIRED status
- **Returns**: Count of updated offers

---

## Database Schema

### Offer Entity
```typescript
{
  title: string;                    // Offer title
  description: string;              // Detailed description
  incentiveAmount: number;          // Amount in rupees
  type: OfferType;                  // Enum: commission_boost, closing_bonus, etc.
  status: OfferStatus;              // Enum: active, paused, closed, expired
  termsAndConditions: string[];     // Array of conditions
  minUnitsToSell?: number;          // Optional minimum units required
  commissionPercentage?: number;    // Optional additional commission % (0-100)
  validFrom?: Date;                 // Optional start date
  validUntil?: Date;                // Optional end date
  createdBy: ObjectId;              // Reference to User (Builder)
  project: ObjectId;                // Reference to Project
  createdAt: Date;
  updatedAt: Date;
}
```

### Indexes
- `status`: Fast filtering by status
- `type`: Fast filtering by offer type
- `project`: Fast lookup by project
- `createdBy`: Fast lookup by builder
- `validFrom, validUntil`: Date range queries

---

## Service Methods

### OffersService

#### `create(user, dto)`
- Creates new offer
- Validates builder owns the project
- Auto-sets status to ACTIVE

#### `findAll(filters)`
- Gets all offers with filters
- Admin/Builder can filter by project, builder, status
- Supports pagination

#### `findAllForAgent(agentId, filters)`
- **Key Method**: Gets offers visible to agent
- Queries agent's associations to get project IDs
- Returns offers ONLY for associated projects
- Supports status filter and pagination

#### `findOne(id, user?)`
- Gets single offer by ID
- If user is agent, validates access to project
- Throws 403 if agent not associated

#### `update(id, user, dto)`
- Updates offer
- Builder can only update own offers
- Admin can update any offer

#### `remove(id, user)`
- Deletes offer
- Builder can only delete own offers
- Admin can delete any offer

#### `findByProject(projectId, filters)`
- Gets all offers for specific project
- Supports status filter and pagination

#### `updateExpiredOffers()`
- Cron job method
- Updates all offers past validUntil to EXPIRED
- Returns count of updated offers

---

## Access Control

### Builder Access
- Can create offers for own projects only
- Can view all offers for own projects
- Can update/delete only own offers
- Cannot see other builders' offers

### Agent Access
- **Visibility Based on Associations**:
  - Agent sees offers ONLY for projects where `AgentBuilderAssociation` exists
  - If agent associated with Builder X for Project Y, sees all offers for Project Y
  - If not associated, throws 403 Forbidden
- Cannot create, update, or delete offers
- Read-only access to associated project offers

### Admin Access
- Full CRUD access to all offers
- Can create offers for any project
- Can filter by builder or project
- Can manually trigger expired offer updates

---

## Integration with Agent-Builder Association

The offers system integrates seamlessly with the `AgentBuilderAssociationService`:

```typescript
// In OffersService.findAllForAgent()
const associations = await this.associationService.getAgentAssociations(agentId);
const projectIds = associations.map((a) => a.projectId);

// Query offers only for these projects
const query = {
  project: { $in: projectIds }
};
```

---

## Usage Examples

### Builder Creates Offer
```bash
POST /builder/offers
Authorization: Bearer <builder_token>

{
  "title": "Early Bird Bonus - First 20 Units",
  "description": "Sell in first month and get ₹1L bonus per unit",
  "incentiveAmount": 100000,
  "type": "early_bird",
  "termsAndConditions": [
    "Valid for first 20 units only",
    "Full payment within 30 days"
  ],
  "minUnitsToSell": 1,
  "validFrom": "2025-01-01T00:00:00.000Z",
  "validUntil": "2025-01-31T23:59:59.000Z",
  "projectId": "64f5a1234567890abcdef345"
}
```

### Agent Views Available Offers
```bash
GET /agent/offers?status=active&page=1&limit=10
Authorization: Bearer <agent_token>

Response:
{
  "data": {
    "offers": [
      {
        "_id": "...",
        "title": "10% Commission Boost",
        "description": "...",
        "incentiveAmount": 50000,
        "type": "commission_boost",
        "status": "active",
        "project": {
          "projectName": "Sunrise Apartments",
          "location": "Bangalore"
        },
        "createdBy": {
          "name": "ABC Builders"
        }
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  },
  "message": "Offers retrieved successfully"
}
```

### Builder Updates Offer Status
```bash
PATCH /builder/offers/64f5a9876543210fedcba123
Authorization: Bearer <builder_token>

{
  "status": "paused",
  "description": "Updated: Offer extended till Feb"
}
```

### Admin Gets All Offers for Builder
```bash
GET /admin/offers?builderId=64f5a1234567890abcdef012&page=1&limit=20
Authorization: Bearer <admin_token>
```

---

## Comparison with Bounty System

| Feature | Bounty | Offer |
|---------|--------|-------|
| **Purpose** | Rewards for specific actions (referrals, tasks) | Incentives for sales performance |
| **Who Creates** | Builder, Admin | Builder, Admin |
| **Agent Action** | Submit proof, get rewarded | View incentives, close sales |
| **Reward Type** | Fixed amount per action | Commission boost, bonuses |
| **Submissions** | Yes (BountySubmission entity) | No submissions needed |
| **Visibility** | All agents can see and submit | Only associated agents see |
| **Approval Flow** | Pending → Approved/Rejected | N/A |
| **Auto-Expire** | Yes | Yes |

---

## Future Enhancements

### Phase 2 (Recommended)
1. **Offer Redemption Tracking**:
   - Entity: `OfferRedemption` (similar to BountySubmission)
   - Track which agent claimed which offer
   - Calculate total earnings per offer

2. **Auto-Assignment**:
   - When agent closes sale, auto-link to applicable offers
   - Calculate commission boost automatically
   - Integration with wallet/payment system

3. **Offer Analytics**:
   - Track offer performance (views, redemptions)
   - Builder dashboard showing ROI per offer
   - Agent leaderboard per offer

4. **Offer Templates**:
   - Pre-defined offer templates for common scenarios
   - Clone existing offers to new projects
   - Bulk offer creation for multiple projects

5. **Notifications**:
   - Notify agents when new offer created for their projects
   - Alert agents when offer about to expire
   - Congratulate agent when offer redeemed

6. **Conditional Offers**:
   - Tiered rewards (sell 1-5: 1%, 6-10: 2%)
   - Time-based multipliers (weekend bonus)
   - Combination offers (refer + sell)

---

## Testing Checklist

### Unit Tests
- [ ] OffersService.create() - validates builder owns project
- [ ] OffersService.findAllForAgent() - returns only associated projects
- [ ] OffersService.findOne() - checks agent access
- [ ] OffersService.update() - validates ownership
- [ ] OffersService.updateExpiredOffers() - updates expired status

### Integration Tests
- [ ] Builder creates offer for own project
- [ ] Builder cannot create offer for other's project
- [ ] Agent sees offers for associated projects only
- [ ] Agent cannot see offers for non-associated projects
- [ ] Admin can create/update/delete any offer
- [ ] Expired offers auto-update status

### Edge Cases
- [ ] Agent with no associations sees empty list
- [ ] Offer with no validUntil never expires
- [ ] Multiple offers per project work correctly
- [ ] Pagination works with large datasets
- [ ] Status filtering works correctly

---

## Deployment Notes

1. **Database Migration**: No migration needed, new collection `offers`
2. **Indexes**: Will be auto-created on first insert
3. **Cron Job**: Set up daily job to call `/admin/offers/update-expired`
4. **Monitoring**: Track offer view counts, redemption rates

---

## Summary

✅ Complete offers system with builder-agent visibility control
✅ 3 separate controllers (Builder, Agent, Admin) with proper role guards
✅ Agent visibility based on AgentBuilderAssociation
✅ Full CRUD operations with access control
✅ Pagination and filtering support
✅ Auto-expire functionality
✅ Type-safe DTOs with validation
✅ Swagger documentation
✅ Similar structure to bounty system for consistency

The offers system is production-ready and fully integrated with the existing agent-builder-project association system!
