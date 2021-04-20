/**
 * Method to retrieve all events for a given name
 * @param web3 a web3 instance
 * @param web3contractInstance
 * @param eventName the name of the event to retrieve
 * @returns events an array of all events with the provided name
 */
export const getPastEvents = async (
  web3,
  web3contractInstance,
  eventName = "allEvents"
) => {
  try {
    const currentBlock = await web3.eth.getBlockNumber();

    const events = await web3contractInstance.getPastEvents(eventName, {
      fromBlock: currentBlock - 1,
      toBlock: "latest",
    });
    return events;
  } catch (error) {
    return [];
  }
};
