import { Address, Cart, Country, FulfillmentStatus, MedusaRequest, MedusaResponse, Order, OrderService, OrderStatus, PaymentStatus, ShippingMethod, ShippingOption } from "@medusajs/medusa";
import { EntityManager, Repository } from "typeorm";

export const POST = async (request: MedusaRequest, response: MedusaResponse) => {
    const {cart_id, region_id} = request.body as any

    if(!cart_id || !region_id) return response.status(400).send({status: false, message: "Invalid cart_id or region_id"})

    const manager: EntityManager = request.scope.resolve("manager")
    const orderService: OrderService = request.scope.resolve("orderService")
    const orderRepo: Repository<Order> = manager.getRepository(Order)
    const countryRepo: Repository<Country> = manager.getRepository(Country)
    const shippingOptionRepo: Repository<ShippingOption> = manager.getRepository(ShippingOption)
    const cartRepo: Repository<Cart> = manager.getRepository(Cart)

    const country = await countryRepo.findOneOrFail({where: {name: "NIGERIA"}})

    const new_shipping_address = new Address()
    new_shipping_address.first_name = "John"
    new_shipping_address.last_name = "Doe",
    new_shipping_address.address_1 = "Parklane hospital"
    new_shipping_address.customer_id = "cus_01JAN426TKVDAH65A2ZF7R95H7"
    new_shipping_address.city = "Enugu"
    new_shipping_address.country = country
    new_shipping_address.phone = "09032435663"

    // Create shipping method for the order using the shipping option
    const shipping_option = await shippingOptionRepo.findOneBy({name: "PostFake Standard"})
    const new_shipping_method = new ShippingMethod()
    new_shipping_method.shipping_option = shipping_option
    new_shipping_method.price = 0
    new_shipping_method.includes_tax = false
    new_shipping_method.total = 0
    new_shipping_method.data = {}

    // Calculate the total from cart
    // Ideally, the order service is used to set up some stuffs like the lineOrders, which in turn, calculates the subtotal and the total

    const order = orderRepo.create({
        cart_id,
        region_id,
        status: OrderStatus.COMPLETED,
        fulfillment_status: FulfillmentStatus.FULFILLED,
        payment_status: PaymentStatus.CAPTURED,
        currency_code: "ngn",
        email: "JohnDoe@customer.com",
        customer_id: "cus_01JAN426TKVDAH65A2ZF7R95H7",
        sales_channel_id: "sc_01J9KVYADNBKKW68DE1NFSFWRY",
        shipping_address: new_shipping_address,
        shipping_methods: [new_shipping_method]
    })

    const saved_order = await orderRepo.save(order)

    return response.status(201).send({success: true, order: saved_order})
}