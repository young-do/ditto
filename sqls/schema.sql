-- ref: https://dbdiagram.io/d/63cf3909296d97641d7b9cf7

CREATE TABLE "groups" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar NOT NULL,
  "created_time" timestamptz NOT NULL DEFAULT (now()),
  "owner_id" int
);

CREATE TABLE "users" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "oauth_id" varchar UNIQUE NOT NULL,
  "nickname" varchar NOT NULL,
  "profile_image" varchar,
  "created_time" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "group_members" (
  "user_id" int NOT NULL,
  "group_id" int NOT NULL,
  "joined_by" int,
  "joined_time" timestamptz NOT NULL DEFAULT (now()),
  PRIMARY KEY ("user_id", "group_id")
);

CREATE TABLE "invitations" (
  "code" varchar PRIMARY KEY,
  "group_id" int NOT NULL,
  "creator_id" int NOT NULL,
  "created_time" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "events" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "title" varchar NOT NULL,
  "description" varchar,
  "start_time" timestamptz NOT NULL,
  "end_time" timestamptz NOT NULL,
  "is_all_day" boolean,
  "is_annual" boolean,
  "creator_id" int NOT NULL,
  "created_time" timestamptz NOT NULL DEFAULT (now()),
  "group_id" int NOT NULL
);

CREATE TABLE "categories" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "title" varchar NOT NULL,
  "creator_id" int NOT NULL,
  "created_time" timestamptz NOT NULL DEFAULT (now()),
  "group_id" int NOT NULL
);

CREATE TABLE "tasks" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "title" varchar NOT NULL,
  "description" varchar,
  "creator_id" int NOT NULL,
  "created_time" timestamptz NOT NULL DEFAULT (now()),
  "categories_id" int NOT NULL,
  "group_id" int NOT NULL
);

CREATE INDEX ON "users" ("oauth_id");

ALTER TABLE "groups" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("id");

ALTER TABLE "group_members" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "group_members" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "group_members" ADD FOREIGN KEY ("joined_by") REFERENCES "users" ("id");

ALTER TABLE "invitations" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "invitations" ADD FOREIGN KEY ("creator_id") REFERENCES "users" ("id");

ALTER TABLE "events" ADD FOREIGN KEY ("creator_id") REFERENCES "users" ("id");

ALTER TABLE "events" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "categories" ADD FOREIGN KEY ("creator_id") REFERENCES "users" ("id");

ALTER TABLE "categories" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "tasks" ADD FOREIGN KEY ("creator_id") REFERENCES "users" ("id");

ALTER TABLE "tasks" ADD FOREIGN KEY ("categories_id") REFERENCES "categories" ("id");

ALTER TABLE "tasks" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");
