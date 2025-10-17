# Feature Specification: CSMC Infinity Contest Registration System

**Feature Branch**: `001-build-an-application`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: User description: "Build an application that accepts registration for csmc infinity contest. Its for registration from online. On visit, - The contestant enter the website <any*url> - He/She (still not sure) will see a loader along with the logo of our contest. - After the loader is gone he/she will see the registration form - The form: Name (text), Institute (text), Class (radio, 5-10), Section (text), Roll (number), Email Address (email), Mobile Number (WhatsApp) (number) (bangladeshi only), Father's Name (text), Mother's Name (text), Category (auto) (5-6 -> Primary, 7-8 -> Junior, 9-10 -> Senior) - Then a username will be generated. Format: CSMC*{CATEGORY*FIRST_LETTER_CAPITALIZED}*{4_DIGIT_NUMBER_STARTING_FROM_0001}. Example: CSMC_P_0001 - after he/she finishes registration and submits the form he/she see a success message where his/her username for examination (CSMC_S/J/P_0001) and rules and a program list of the whole contest - Also if he enters the website after registering from the same device he will see the success page only no loader and registration form"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - First-Time Registration Journey (Priority: P1)

A student visits the contest website for the first time and completes registration to receive their examination username and contest details.

**Why this priority**: This is the core functionality—without registration, no other contest activities can proceed. This story delivers immediate value by allowing students to sign up.

**Independent Test**: Can be fully tested by visiting the site on a new device, completing the registration form with valid data, and verifying the success page displays the unique username and contest information.

**Acceptance Scenarios**:

1. **Given** a student visits the website URL for the first time, **When** the page loads, **Then** they see a branded loader with contest logo and welcome message ("Welcome to the registration forum of CSMC Infinity Contest organized by: Collegiate School Math Club sponsored by: <sponsor>")
2. **Given** the loader completes, **When** the registration form appears, **Then** all form fields are visible (Name, Institute, Class, Section, Roll, Email, Mobile, Father's Name, Mother's Name)
3. **Given** a student is viewing the form, **When** they select Class 5 or 6, **Then** their category is automatically set to "Primary"
4. **Given** a student is viewing the form, **When** they select Class 7 or 8, **Then** their category is automatically set to "Junior"
5. **Given** a student is viewing the form, **When** they select Class 9 or 10, **Then** their category is automatically set to "Senior"
6. **Given** a student completes all required fields with valid data, **When** they submit the form, **Then** a unique username is generated in format CSMC_P_XXXX (Primary), CSMC_J_XXXX (Junior), or CSMC_S_XXXX (Senior) with sequential 4-digit numbers starting from 0001
7. **Given** registration is successful, **When** the success page loads, **Then** the student sees their examination username, contest rules, and program schedule
8. **Given** the student sees the success page, **When** they review the information, **Then** they can identify their username clearly and understand next steps

---

### User Story 2 - Returning Visitor Recognition (Priority: P2)

A student who has already registered revisits the website from the same device and immediately sees their registration confirmation without re-registering.

**Why this priority**: Prevents duplicate registrations and provides a better user experience by showing existing registration details. This is independent functionality that enhances the system without blocking core registration.

**Independent Test**: Register on a device, close the browser, return to the website on the same device, and verify the success page displays immediately without showing the loader or registration form.

**Acceptance Scenarios**:

1. **Given** a student has previously registered on their device, **When** they revisit the website URL, **Then** they immediately see the success page with their username and contest details (no loader, no registration form)
2. **Given** a returning registered student views their success page, **When** they review the information, **Then** their previously assigned username and all contest details remain consistent

---

### User Story 3 - Form Validation and Error Handling (Priority: P2)

Students receive clear, helpful feedback when they enter invalid or incomplete information, ensuring data quality and reducing registration errors.

**Why this priority**: Essential for data integrity and user experience, but can be implemented after basic registration flow works. Independent from core registration logic.

**Independent Test**: Attempt to submit forms with missing fields, invalid email formats, invalid phone numbers, and verify appropriate inline error messages appear next to each field.

**Acceptance Scenarios**:

1. **Given** a student is filling the registration form, **When** they leave a required field empty and attempt to submit, **Then** an inline error message appears next to the empty field indicating it is required
2. **Given** a student enters an email address, **When** the email format is invalid (missing @, invalid domain), **Then** an inline error appears indicating proper email format
3. **Given** a student enters a mobile number, **When** the number is not a valid Bangladeshi mobile number format (not 11 digits starting with 01), **Then** an inline error appears indicating valid format requirements
4. **Given** a student enters a roll number, **When** the value is not numeric or is negative, **Then** an inline error appears indicating valid number format
5. **Given** a form has validation errors, **When** the student attempts to submit, **Then** focus moves to the first error field to assist correction

---

### Edge Cases

- What happens when a student tries to register with an email or mobile number already used by another contestant?
- What happens if two students submit registration simultaneously and both qualify for the same sequential username number?
- What happens when the student's device storage/cookies are cleared after registration—can they re-register?
- What happens if the registration form is submitted while the student is offline?
- What happens when Class selection changes after partial form completion (category should update automatically)?
- What happens when the loader fails to load assets (logo image)?
- What happens when the success page is accessed directly via URL without completing registration?
- What happens when a student uses special characters or excessively long text in name/institute fields?
- What happens when the mobile number format is from other countries (non-Bangladeshi)?
- What happens when the sponsor badge/logo is not available (<TODO_BADGE>)?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a branded loader on first visit showing contest logo and welcome message: "Welcome to the registration forum of CSMC Infinity Contest organized by: Collegiate School Math Club sponsored by: <sponsor>"
- **FR-002**: System MUST present a registration form after loader completes with fields: Name (text), Institute (text), Class (radio buttons 5-10), Section (text), Roll (number), Email Address (email), Mobile Number (number), Father's Name (text), Mother's Name (text)
- **FR-003**: System MUST automatically derive Category based on Class selection: Classes 5-6 = "Primary", Classes 7-8 = "Junior", Classes 9-10 = "Senior"
- **FR-004**: System MUST validate that Mobile Number follows Bangladeshi phone number format (11 digits starting with 01)
- **FR-005**: System MUST validate email addresses for proper format (contains @, valid domain structure)
- **FR-006**: System MUST validate that Roll is a positive numeric value
- **FR-007**: System MUST generate unique examination usernames in format: CSMC*{CATEGORY_LETTER}*{SEQUENTIAL_NUMBER} where CATEGORY_LETTER is P (Primary), J (Junior), or S (Senior), and SEQUENTIAL_NUMBER is a 4-digit number starting from 0001 (e.g., CSMC_P_0001, CSMC_J_0023, CSMC_S_0156)
- **FR-008**: System MUST ensure username sequential numbering is unique per category (no duplicate CSMC_P_0001, but CSMC_P_0001 and CSMC_J_0001 can both exist)
- **FR-009**: System MUST display a success page after successful registration showing: the assigned examination username, contest rules, and program schedule
- **FR-010**: System MUST persist registration data so that when a student revisits from the same device, they see the success page immediately without loader or form
- **FR-011**: System MUST prevent duplicate registrations from the same device by recognizing returning visitors
- **FR-012**: System MUST display inline validation errors next to fields when data is invalid or missing
- **FR-013**: System MUST move focus to the first error field when form submission fails validation
- **FR-014**: System MUST make all form fields required (no optional fields)
- **FR-015**: System MUST support keyboard navigation for all interactive elements (form fields, radio buttons, submit button)
- **FR-016**: System MUST provide clear visual feedback during form submission (loading state, disabled submit button)
- **FR-017**: Contest rules and program schedule sections MUST be clearly marked as placeholders (<TODO_COMPONENT>) for future content integration
- **FR-018**: Sponsor badge in loader message MUST be clearly marked as placeholder (<TODO_BADGE>) for future content integration

### Assumptions

- Students have access to modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Students register from personal devices (mobile, tablet, or desktop)
- Device recognition for returning visitors uses browser local storage or cookies
- Bangladeshi mobile number format: 11 digits starting with "01" (standard BD mobile format)
- Contest organizers will provide sponsor badge image and program/rules content in future phases
- Sequential username numbering starts fresh at 0001 for each category (P, J, S)
- Registration data is stored persistently (database/backend handles storage and uniqueness)
- Internet connectivity is required for form submission
- One registration per device is acceptable business logic (device = browser + storage)

### Key Entities

- **Contestant**: Represents a student registering for the contest. Attributes include Name, Institute, Class (5-10), Section, Roll Number, Email Address, Mobile Number (Bangladeshi), Father's Name, Mother's Name, derived Category (Primary/Junior/Senior), and assigned unique examination Username (CSMC_X_XXXX format).
- **Registration Session**: Represents the device/browser state tracking whether a visitor has completed registration. Used to determine if returning visitors should see the form or success page.
- **Contest Information**: Represents the rules and program schedule displayed on the success page. Currently marked as placeholder components for future content integration.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Students can complete the entire registration process from landing page to success page in under 3 minutes
- **SC-002**: 95% of students successfully complete registration on their first attempt without encountering validation errors (assuming valid data entry)
- **SC-003**: 100% of generated usernames are unique within their category and follow the exact format CSMC*{P|J|S}*{4-digit-number}
- **SC-004**: Returning students (same device) see their success page within 2 seconds without going through loader or form again
- **SC-005**: All form validation errors are displayed inline next to the relevant field within 500ms of user interaction
- **SC-006**: The system handles at least 100 concurrent registration submissions without username duplication or data loss
- **SC-007**: Mobile number validation correctly rejects 100% of non-Bangladeshi phone number formats
- **SC-008**: Category assignment accuracy is 100% based on Class selection (5-6→Primary, 7-8→Junior, 9-10→Senior)
- **SC-009**: Keyboard-only users can complete the entire registration process using only Tab, Arrow keys, and Enter
- **SC-010**: The loader completes and transitions to the form within 5 seconds on standard 4G mobile connections
