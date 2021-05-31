import {server} from "../../../../tools/servers";

export class VoteApi{
    static getVoteList(data){
      return server.connection('POST','/Service/VoteController/selectByTitleAndTimeAndStatus',data);
    }
    static addVote(data){
      return server.connection('POST','/Service/VoteController/insertVote',data);
    }
    static updateVote(data){
      return server.connection('POST','/Service/VoteController/updateVote',data);
    }
    static deleteOption(data){
      return server.connection('GET','/Service/VoteController/deleteOption',data);
    }
}
