CREATE TABLE `vipps_credentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` varchar(255) NOT NULL,
	`client_secret` varchar(500) NOT NULL,
	`subscription_key` varchar(255) NOT NULL,
	`merchant_serial_number` varchar(50) NOT NULL,
	`test_mode` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vipps_credentials_id` PRIMARY KEY(`id`)
);
