## Coding Conventions
  - **Hungarian Notation** : Use Hungarian notation for variable naming
  - **camelCase** : Use camelCase when naming all variables
  - **Async Javascript** : Prefer to use async await rather than .then when performing asynchornous javascript functions
  - **No Build Tools** : Avoid build tools such as babel, webpack, or vite unless it is explicitly required. Code must run either directly in the browser or via nodeJS
  - **Dependencies** : Do not add external libraries such as jQuery without approval. Prefer native Web APIs
  - **ECMAScript Version** : Target ES6+ features including arrow functions and template literals as well as promises
  - **External Libraries Local** : All external libraries that are included must not use a cdn but must be included in project source files
  - **Bootstrap Utility Classes** : Use only standard bootstrap 5+ utility classes for layout, spacing, and colors. Avoid creating custom css classes or inline styles unless the design cannot be achived without them

## Accessibility
  - **Standards** : All user interfaces must meet WCAG 2.1+ accessiblity standards 
  - **Alt Tags** : All images must also have an alt tag attribute that describes the image
  - **Priority** : Prioritize accessibility over design
  - **ARIA Labels** : Include aria labels aon all HTML form controls

## Project Scructure
  - **Entry Point** : All nodeJS applications must use server.js for entry point
  - **API Routes** : All API routes must be included in the /api/ routing

## API Requirements
  - **RESTful** : All API routes should be RESTful in design
  - **UPDATE** : All UPDATE routes should use PUT rather than PATCH
  - **DELETE** : DELETE routes should use URL parameters for primary key indicators
  - **SELECT** : All user inputs for SELECT should be passed via URL query strings
  - **CREATE** : All user inputs for CREATES should be passed as JSON body data
  - **Input Validation** : All user-passed inputs should be user validated

## Do Not
  - Do not hardcode credentials
  - Do not intermix user inputs in queries, require prepared statements
  - Do not skip input validation

## Decision Guidelines
  - Prefer simpler, less complex, and maintainable code
  - Ask for clarification if uncertain

## Testing
  - Ensure all GET API routes return JSON arrays
  - Handle any missing input data with proper error messaging
  - POST and PUT routes should validate all required fields
