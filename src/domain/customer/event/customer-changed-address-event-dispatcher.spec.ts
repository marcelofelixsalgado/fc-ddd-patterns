import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerChangedAddressEvent from "./customer-changed-address.event";
import WriteConsolelWhenCustomerAddressChanged from "./handler/write-console-when-customer-address-changed.handler";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new WriteConsolelWhenCustomerAddressChanged();

    eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new WriteConsolelWhenCustomerAddressChanged();

    eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandler);

    eventDispatcher.unregister("CustomerChangedAddressEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(0);
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new WriteConsolelWhenCustomerAddressChanged();

    eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new WriteConsolelWhenCustomerAddressChanged();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandler);

    const customerChangedAddressEvent = new CustomerChangedAddressEvent({
      id: 1,
      name: "Customer 1",
      address: {
        street: "Avenida Paulista",
        number: 1000,
        zip: 123456,
        city: "São Paulo",
      }
    });

    eventDispatcher.notify(customerChangedAddressEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
