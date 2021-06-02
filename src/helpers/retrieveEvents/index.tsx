/**
 * Method to retrieve all events for a given name
 * @param web3 a web3 instance
 * @param syndicateContractInstance
 * @param eventName the name of the event to retrieve
 * @returns events an array of all events with the provided name
 */
export const getEvents = async (
  syndicateContractInstance,
  eventName = "allEvents",
  filter = {}
) => {
  try {
    const fromBlock = process.env.NEXT_PUBLIC_FROM_BLOCK;

    const events = await syndicateContractInstance.getPastEvents(eventName, {
      filter,
      fromBlock,
      toBlock: "latest",
    });
    return events;
  } catch (error) {
    return [];
  }
};
