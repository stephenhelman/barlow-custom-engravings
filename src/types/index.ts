import type {
  Item,
  Tag,
  ItemTag,
  Offering,
  Order,
  ItemStatus,
  ContentType,
  TagCategory,
  OrderStatus,
} from "@prisma/client";

export type {
  Item,
  Tag,
  ItemTag,
  Offering,
  Order,
  ItemStatus,
  ContentType,
  TagCategory,
  OrderStatus,
};

export type ItemWithTags = Item & {
  tags: (ItemTag & { tag: Tag })[];
};

export type OrderWithItem = Order & {
  referenceItem: ItemWithTags | null;
};
