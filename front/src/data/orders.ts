import { OrderStatus, OrganisationType } from "../types/enumerations";

export default [
  {
    organisation: OrganisationType.SNB,
    items: [
      {
        product: {
          name: "Chap 50 CL",
          unitPrice: 1000,
          rackPrice: 1000,
          packPrice: 20000,
          volume: 2000,
        },
        quantity: 10,
        price: 2000,
      },
      {
        product: {
          name: "Chap Cola 50 CL",
          unitPrice: 500,
          rackPrice: 1000,
          packPrice: 20000,
          volume: 200,
        },
        quantity: 220,
        price: 200,
      },
    ],
    totalAmount: 1000000,
    transaction: {},
    status: OrderStatus.DELIVERY,
    deliveryDate: Date,
  },
];
