import { supabase } from '@/lib/supabase/client';
import { CreateEventType } from './type';

export const createEvent = async ({
  title,
  description,
  creatorId,
  groupId,
  isAllDay,
  isAnnual,
  startTime,
  endTime,
}: CreateEventType) => {
  const { error } = await supabase.from('events').insert({
    title,
    description,
    creator_id: creatorId,
    group_id: groupId,
    is_all_day: isAllDay,
    is_annual: isAnnual,
    start_time: startTime,
    end_time: endTime,
  });

  if (error) throw new Error(error.message);
  return;
};
