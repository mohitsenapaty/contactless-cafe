CREATE TABLE orderrequest (
    "createdAt" character varying,
    "updatedAt" character varying,
    id integer primary key,
    orderid uuid not null,
    customername text,
    customerphone text,
    totalprice real,
    status text
);

CREATE SEQUENCE orderrequest_id_seq;

ALTER SEQUENCE orderrequest_id_seq OWNED BY orderrequest.id;

ALTER TABLE ONLY orderrequest ALTER COLUMN id SET DEFAULT nextval('orderrequest_id_seq'::regclass);

CREATE TABLE item (
    "createdAt" character varying,
    "updatedAt" character varying,
    id integer primary key,
    itemid uuid NOT NULL,
    itemname text NOT NULL,
    price real,
    description text,
    picurl text,
    status text
);

CREATE SEQUENCE item_id_seq;

ALTER SEQUENCE item_id_seq OWNED BY item.id;

ALTER TABLE ONLY item ALTER COLUMN id SET DEFAULT nextval('item_id_seq'::regclass);

CREATE TABLE orderitem (
    "createdAt" character varying,
    "updatedAt" character varying,
    id integer primary key,
    orderitemid uuid NOT NULL,
    orderid uuid not null,
    itemid uuid NOT NULL,
    quantity real NOT NULL,
    totalprice real,
    status text
);

CREATE SEQUENCE orderitem_id_seq;

ALTER SEQUENCE orderitem_id_seq OWNED BY orderitem.id;

ALTER TABLE ONLY orderitem ALTER COLUMN id SET DEFAULT nextval('orderitem_id_seq'::regclass);

alter table orderrequest add column tableid integer;

alter table item add column catagory text;
