module.exports = cds.service.impl(async function () {

   const { stockset } = this.entities;
   this.before('CREATE', 'stockset', async function (req) {
      const { symbol, name, quantity, avgprice, mktprice } = req.data;
      //console.log(req.data);
      if (quantity <= 0) {
         req.error(400, 'Quantity must be greater than 0');
      }
      const exists = await SELECT.one.from(stockset).where({ symbol});
      //console.log(exists);
      if (exists) {
          req.error(400, 'Stock already exists');         
       }
      req.data.invested = quantity * avgprice;
      req.data.current = quantity * mktprice;
      req.data.totreturns = ((req.data.current - req.data.invested) / req.data.invested) * 100;
   });

   this.after('READ', 'stockset', async (data, res) => {
      data.forEach((item, index) => {
         //res.results[index].invested = item.quantity * item.avgprice;
         //res.results[index].current = item.quantity * item.mktprice;
         data[index].invested = item.quantity * item.avgprice;
         data[index].current = item.quantity * item.mktprice;
         data[index].totreturns = ((data[index].current - data[index].invested) / data[index].invested) * 100 + '%';
      });

   })

   this.before('DELETE', 'stockset', async (req) => {
      console.log(req.params[0]);
      const { id } = req.params[0];
      const exists = await SELECT.one.from(stockset).where({ id });
      if (!exists) {
         req.error(404, 'Stock not found');
      }
   })

   this.after('READ', 'holdings', async (data) => {
      //console.log(data[0].current);
      let totret = 0;
      let sign = '';
      totret = ((data[0].current - data[0].invested) / data[0].invested) * 100;
      sign = totret > 0 ? '+' : '-';
      data[0].returns = sign + Math.abs(totret).toFixed(2) + '%';

});

});