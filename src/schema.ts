export const DB_SCHEMA = `
    You have acccess to a SQL SErver databe with the following tables:

    --- CORE TABLES ---

TABLE: project
  - id (INT, PK)
  - name (NVARCHAR)
  - customer_fk (INT, FK -> customer.id)
  - address_fk (INT, FK -> address.id)
  - created_by (INT, FK -> employee.id)
  - status (TINYINT) -- project status
  - active (BIT) -- soft delete flag
  - subtotal, tax_rate, tax, total (DECIMAL) -- financial summary
  - closing_date_sale (DATETIME2) -- when the sale was closed
  - proposal_deadline (DATETIME2) -- deadline to submit proposal
  - tentative_date (DATETIME2) -- estimated project start
  - invoice (NVARCHAR) -- project code
  - description (NVARCHAR)
  - created_at, updated_at, canceled_at (DATETIME2)
  - cancelation_reason (TINYINT)
  - cancelation_note (NVARCHAR)

TABLE: customer
  - id (INT, PK)
  - name (NVARCHAR)
  - rfc (NVARCHAR) -- Mexican tax ID
  - email (NVARCHAR)
  - phoneNumber (NVARCHAR)
  - active (BIT)
  - user_fk (BIGINT, FK -> users.id)

TABLE: employee
  - id (INT, PK)
  - name (NVARCHAR)
  - lastname (NVARCHAR)
  - phoneNumber (NVARCHAR)
  - active (BIT)
  - user_fk (BIGINT, FK -> users.id)

TABLE: address
  - id (INT, PK)
  - customer_fk (INT, FK -> customer.id)
  - state, city, street, neighborhood (NVARCHAR)
  - zip_code, ext_num, int_num (NVARCHAR)
  - latitude, longitude (DECIMAL)

--- QUOTATION TABLES ---

TABLE: quotation
  - id (INT, PK)
  - project_fk (INT, FK -> project.id)
  - quotation_origin_fk (INT, FK -> quotation.id) -- if revised from another quotation
  - quotation_number (INT) -- version number within a project
  - code (NVARCHAR) -- unique identifier
  - status (TINYINT)
  - active (BIT)
  - days (INT) -- estimated project duration in days
  - operators (INT) -- number of operators needed
  - currency (NVARCHAR) -- 'MXN' or 'USD'
  - dollar_mx_value (DECIMAL) -- USD/MXN exchange rate used
  - total_services_cost, total_overhead_cost, grand_total_cost (DECIMAL)
  - min_margin_percentage, max_margin_percentage (DECIMAL)
  - utility_amount (DECIMAL)
  - tax_rate, tax, final_price (DECIMAL)
  - created_by (INT) -- employee id, not FK constrained
  - created_at, updated_at (DATETIME2)

TABLE: quotation_detail
  - id (INT, PK)
  - quotation_fk (INT, FK -> quotation.id)
  - scope_fk (INT, FK -> project_engineering_scope.id)
  - product_fk (INT, FK -> engineering_product.id)
  - bundle_fk (INT, FK -> bundle.id) -- nullable
  - unit_fk (INT, FK -> product_unit.id)
  - amount (DECIMAL)
  - unit_cost, unit_price (DECIMAL)
  - total_cost, total_price (DECIMAL)
  - description (NVARCHAR)

TABLE: quotation_overhead
  - id (INT, PK)
  - quotation_fk (INT, FK -> quotation.id)
  - overhead_fk (INT, FK -> overhead.id)
  - amount, unit_price, total (DECIMAL)
  - unit (NVARCHAR)
  - percentage (DECIMAL)
  - notes (NVARCHAR)

--- ENGINEERING / SCOPE TABLES ---

TABLE: engineering
  - id (INT, PK)
  - name (NVARCHAR) -- type of engineering e.g. electrical, mechanical
  - active (BIT)

TABLE: project_engineering_scope
  - id (INT, PK)
  - project_fk (INT, FK -> project.id)
  - engineering_fk (INT, FK -> engineering.id)
  - has_infrastructure (BIT)

TABLE: project_engineering_brands
  - id (INT, PK)
  - scope_fk (INT, FK -> project_engineering_scope.id)
  - brand_fk (INT, FK -> brand.id)

--- PRODUCT CATALOG ---

TABLE: engineering_product
  - id (INT, PK)
  - description (NVARCHAR)
  - code (NVARCHAR)
  - brand_fk (INT, FK -> brand.id)
  - category_fk (INT, FK -> product_category.id)
  - supplier_fk (INT, FK -> supplier.id)
  - unit_cost (DECIMAL)
  - currency (NVARCHAR)
  - active (BIT)

TABLE: product_category
  - id (INT, PK)
  - name (NVARCHAR)

TABLE: brand
  - id (INT, PK)
  - name (NVARCHAR)

TABLE: supplier
  - id (INT, PK)
  - name (NVARCHAR)

TABLE: product_unit
  - id (INT, PK)
  - name (NVARCHAR) -- e.g. 'PZA', 'MT', 'HR'

--- OVERHEAD CATALOG ---

TABLE: overhead
  - id (INT, PK)
  - description (NVARCHAR)
  - unit (NVARCHAR)
  - unit_cost (DECIMAL)
  - currency (NVARCHAR)
  - category_fk (INT, FK -> overhead_category.id)
  - active (BIT)

TABLE: overhead_category
  - id (INT, PK)
  - name (NVARCHAR)

--- ACTIVITY LOG ---

TABLE: project_logbook
  - id (BIGINT, PK)
  - project_fk (INT, FK -> project.id)
  - employee_fk (INT, FK -> employee.id)
  - type (NCHAR)
  - description (NVARCHAR)
  - created_at (DATETIME)
`;