using {cap.stocks as db} from '../db/schema';

service stockssrv {
    entity stockset as projection on db.stocks;

    entity holdings as projection on db.holdings;


}
