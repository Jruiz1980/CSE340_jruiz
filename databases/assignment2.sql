-- Data for table `account`
INSERT INTO public.account (
    account_firstname, 
	account_lastname, 
	account_email, 
	account_password
    )
VALUES(
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
    );

-- Update data for 'account_type'
UPDATE account
    SET account_type = 'Admin'
    WHERE account_id = 1;

-- Delete data for `account_id`
DELETE FROM account
	WHERE account_id = 1;
	
-- Update data for table `inventory`
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;
