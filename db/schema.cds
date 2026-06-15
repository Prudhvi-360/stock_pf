namespace cap.stocks;

entity stocks {
    key id         : UUID;
        symbol     : String(20);
        name       : String(80);
        quantity   : Int16;
        current    : Decimal(12, 2);
        invested   : Decimal(12, 2);
        mktprice   : Decimal(12, 2);
        avgprice   : Decimal(12, 2);
        totreturns : Int16;
        datetime   : Timestamp @cds.on.insert : $now;
}

entity holdings as
    select from stocks {
        ''                       as returns     : String(40),
        sum((
            mktprice - avgprice
        ) * quantity)            as totalreturn : Int16,
        sum(quantity * avgprice) as invested    : Decimal(12, 2),
        sum(quantity * mktprice) as current     : Decimal(12, 2),
    }
