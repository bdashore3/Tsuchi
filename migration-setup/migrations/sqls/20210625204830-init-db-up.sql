/* Replace with your SQL commands */
create table users
(
    username text not null
        constraint users_pk
            primary key
);

alter table users
    owner to postgres;

create table mangas
(
    "title"  text not null,
    "source" text,
    username      text not null
        constraint "FK_mangas_users_username"
            references users
            on delete cascade,
    constraint mangas_pkey
        primary key ("title", username)
);

alter table mangas
    owner to postgres;

create table services
(
    "service_name" text not null,
    "api_name"     text,
    "api_secret"   text,
    username      text not null
        constraint "FK_services_users_username"
            references users
            on delete cascade,
    constraint services_pkey
        primary key ("service_name", username)
);

alter table services
    owner to postgres;
