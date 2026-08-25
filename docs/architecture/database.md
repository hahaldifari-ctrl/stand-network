# STAND Network - Database Architecture



**Status:** Foundational  

**Version:** 1.0  

**Date:** 2026-08-25



---



## 1. Purpose



This document defines the conceptual database architecture for STAND Network.



The database will support:



\- Identity

\- Organizations

\- Cases

\- Verification

\- Needs

\- Responses

\- Prayer

\- Giving

\- Partnerships

\- Volunteers

\- Stories

\- Media

\- Notifications

\- Auditability

\- Impact measurement



The database is designed around the real-world STAND domain rather than the structure of the website.



---



## 2. Database Strategy



STAND will use a relational database.



Initial direction:



\- PostgreSQL

\- Prisma ORM

\- UUID identifiers

\- Explicit relationships

\- Strong referential integrity

\- Auditability

\- Role-based access control



The database must support future multi-country expansion.



---



## 3. Identity Domain



### User



Represents an individual using STAND.



Important fields will include:



\- id

\- email

\- phone

\- name

\- status

\- email verification status

\- createdAt

\- updatedAt



Sensitive personal information must not automatically become publicly accessible.



---



### Role



Represents a collection of permissions.



Initial roles may include:



\- USER

\- VOLUNTEER

\- PARTNER\_MEMBER

\- PARTNER\_ADMIN

\- CASE\_REVIEWER

\- RESPONSE\_COORDINATOR

\- FINANCE\_ADMIN

\- CONTENT\_ADMIN

\- SUPPORT\_ADMIN

\- SUPER\_ADMIN



Roles should be extensible.



---



### Permission



Represents a specific capability.



Examples:



\- CASE\_CREATE

\- CASE\_VIEW

\- CASE\_VERIFY

\- CASE\_PUBLISH

\- CASE\_UPDATE

\- NEED\_CREATE

\- RESPONSE\_MANAGE

\- PARTNER\_REVIEW

\- DONATION\_VIEW

\- FINANCE\_MANAGE

\- STORY\_PUBLISH

\- AUDIT\_VIEW



Permissions should be separate from roles.



---



## 4. Organization Domain



### Organization



Represents a church, ministry, NGO, community organization, or other group.



Possible organization types:



\- CHURCH

\- MINISTRY

\- NGO

\- RELIEF\_ORGANIZATION

\- COMMUNITY\_ORGANIZATION

\- PROFESSIONAL\_ORGANIZATION

\- RESEARCH\_ORGANIZATION

\- OTHER



---



### OrganizationMembership



Connects a User with an Organization.



Important concepts:



\- User

\- Organization

\- Role

\- Membership status

\- Joined date



A User may belong to multiple organizations.



An Organization may have many users.



---



## 5. Geographic Domain



### Country



Represents a country where STAND operates.



Nigeria is the initial focus.



---



### Region



Represents a major geographic subdivision.



Examples:



\- State

\- Province

\- Territory

\- Region



---



### Area



Represents a more specific geographic area.



Examples:



\- District

\- Local Government Area

\- Municipality

\- Community



Geographic information must support different administrative structures between countries.



---



## 6. Case Domain



### Case



Represents a situation reported to STAND.



Important concepts include:



\- Case number

\- Title

\- Summary

\- Status

\- Severity

\- Country

\- Region

\- Area

\- Created date

\- Published date

\- Resolved date



A Case may be:



\- Public

\- Restricted

\- Internal



The database must not assume that all case information is safe for public display.



---



### AffectedGroup



Represents the people affected by a Case.



An affected group could represent:



\- Individual

\- Family

\- Church

\- Community

\- Multiple families

\- Other group



The system should allow aggregate information such as:



\- Estimated people affected

\- Estimated families affected

\- Adults

\- Children



Exact identities should be stored separately where necessary.



---



### CaseVerification



Records verification activity associated with a Case.



Important concepts include:



\- Verification source

\- Reviewer

\- Verification status

\- Evidence reference

\- Verification notes

\- Timestamp



Verification information is sensitive and should be access-controlled.



---



## 7. Need Domain



### Need



Represents a requirement associated with a Case.



Examples:



\- FOOD

\- SHELTER

\- MEDICAL

\- EDUCATION

\- CLOTHING

\- TRANSPORT

\- LIVELIHOOD

\- REBUILDING

\- TRAUMA\_SUPPORT

\- EMERGENCY\_FINANCIAL\_SUPPORT



A Case may have multiple Needs.



A Need should have its own lifecycle and priority.



---



## 8. Response Domain



### Response



Represents an organized intervention addressing one or more Needs.



A Response may be:



\- Planned

\- Active

\- Paused

\- Completed

\- Cancelled



A Response may involve one or more organizations.



---



### ResponsePartner



Connects an Organization with a Response.



This allows multiple trusted organizations to collaborate on one response.



Example:



```text

Response

&#x20;  |

&#x20;  +-- STAND

&#x20;  |

&#x20;  +-- Local Church

&#x20;  |

&#x20;  +-- Relief Organization


