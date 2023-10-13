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

-- Using a INNER JOIN
SELECT inv_make, inv_model, cl.classification_name
    FROM inventory i
        INNER JOIN classification cl
        ON i.classification_id = cl.classification_id
    WHERE cl.classification_id = 2;

-- Update `inventory`
START TRANSACTION;

    UPDATE inventory
        SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles');

    UPDATE inventory
        SET inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');

COMMIT;
