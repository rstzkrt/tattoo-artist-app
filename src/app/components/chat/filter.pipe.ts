import { Pipe, PipeTransform } from '@angular/core';
import {User} from "stream-chat";

@Pipe({
  name: 'filterMembers',
  pure: false
})
export class FilterMembersPipe implements PipeTransform {
  transform(members: any, authenticatedUserUid: string): User {
    if (!members || !authenticatedUserUid) return members;
    const otherUserUid = Object.keys(members).filter(
      (key) => key !== authenticatedUserUid
    )[0]
    return members[otherUserUid].user
  }
}
