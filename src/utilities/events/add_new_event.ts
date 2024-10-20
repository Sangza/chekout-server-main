import { MoreThan, Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import { chekoutEvents, ChekoutEvent } from "../../models/chekout_event";

export default async function CreateNewEvent(
  user_id: string,
  event_type: string,
  EventRepository: Repository<ChekoutEvent>
) {
  if (!Object.values(chekoutEvents).includes(event_type))
    throw Error(
      "Event does not match chekout events => utilities/events/add_new_event.ts"
    );

  // Ensure that the user has not initiated another event apart from the current event (Not older than 10 minutes)
  const tenMinutesAgo = () => new Date(Date.now() - 10 * 60 * 1000);

  let recentEvents = await EventRepository.find({
    select: {
      event_type: true,
    },
    where: {
      created_at: MoreThan(tenMinutesAgo()), // Return the ones where the timestamp is greater than the timestamp of 10 mins ago
      user_id,
    },
  });

  recentEvents.filter(event => event.event_type != event_type);

  if (recentEvents.length > 0) {
    throw new MedusaError(
      MedusaError.Types.CONFLICT,
      "An event is already in progress, Please complete that event"
    );
  }

  console.log(recentEvents);
}
