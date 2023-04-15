export default async function (req, res) {
  fetch(
    "https://firestore.googleapis.com/v1/projects/gavelcast/databases/(default)/documents/summaries/home"
  )
    .then((response) => response.json())
    .then((data) => {
      let todaysSales = [];
      let tomorrowsSales = [];
      let remainingSales = [];

      let homePageData = data.fields;
      homePageData["tiles"].arrayValue.values.forEach((tile) => {
        const sale = tile["mapValue"].fields;
        sale["title"].stringValue;

        if (!sale["hidden"].booleanValue) {
          //   console.log(sale["title"].stringValue);
          //   console.log(sale["location"].stringValue);
          //   console.log(sale["category"].stringValue);
          //   console.log(sale["startAt"].mapValue.fields.timestamp.timestampValue);
          //   console.log(sale["isToday"].booleanValue);
          //   console.log(sale["isTomorrow"].booleanValue);
          //   console.log(sale["isLive"].booleanValue);

          const title = sale["title"].stringValue || "No title";
          const location = sale["location"].stringValue || "";
          const category = sale["category"].stringValue || "";
          const startAt =
            sale["startAt"].mapValue.fields.timestamp.timestampValueg;
          const isToday = sale["isToday"].booleanValue;
          const isTomorrow = sale["isTomorrow"].booleanValue;
          const isLive = sale["isLive"].booleanValue;

          const saleSummaryText = `- ${title} (${category}) at ${location} at ${startAt}\n`;

          if (isToday) {
            todaysSales.push(saleSummaryText);
          } else if (isTomorrow) {
            tomorrowsSales.push(saleSummaryText);
          } else {
            //remainingSales.push(saleSummaryText);
          }
        }
      });

      let summaryText =
        "There are " +
        todaysSales.length +
        " sales today and " +
        tomorrowsSales.length +
        " sales tomorrow.\n\n";
      summaryText += "Today's Sales:\n";
      summaryText += todaysSales.join("\n");
      summaryText += "\n\n";

      if (tomorrowsSales.length > 0) {
        summaryText += "Tomorrows Sales:\n";
        summaryText += tomorrowsSales.join("\n");
      } else {
        summaryText += "No sales tomorrow";
      }

      if (remainingSales.length > 0) {
        summaryText += "\n\n";
        summaryText += "Other Sales:\n";
        summaryText += remainingSales.join("\n");
      }

      console.log(summaryText);

      res.status(200).json({ result: summaryText });

      // if (homePageData) {
      //   function mapdata(sale) {
      //     let title = sale.title || "No title";
      //     // convert title to title case
      //     title = title.replace(/\w\S*/g, function (txt) {
      //       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      //     });

      //     return {
      //       title: title,
      //       category: sale.category || "No category",
      //       market: sale.location || "No market",
      //       country: sale.countryCode || "No country",
      //       link: `https://app.marteye.ie${sale.link}`,
      //       type: sale.type === "auction" ? "Live Auction" : "Timed Sale",
      //     };
      //   }

      //   let todaysSales = homePageData.tiles
      //     .filter((t) => !t.hidden)
      //     .filter((t) => t.isToday)
      //     .map(mapdata);
      //   let tomorrowsSales = homePageData.tiles
      //     .filter((t) => !t.hidden)
      //     .filter((t) => t.isTomorrow)
      //     .map(mapdata);

      //   // Add a new line to saleInfo for each sale
      //   saleInfo = `There are ${todaysSales.length} sales today and ${
      //     tomorrowsSales.length
      //   } sales tomorrow.

      // Today's Sales:
      // | Title | Category | Market | Country | Link | Type |
      // | --- | --- | --- | --- | --- | --- |
      // ${todaysSales
      //   .map(
      //     (sale) =>
      //       `| ${sale.title} | ${sale.category} | ${sale.market} | ${sale.country} | ${sale.link} | ${sale.type} |`
      //   )
      //   .join("\n")}

      // Tomorrow's Sales:
      // | Title | Category | Market | Country | Link | Type |
      // | --- | --- | --- | --- | --- | --- |
      // ${tomorrowsSales
      //   .map(
      //     (sale) =>
      //       `| ${sale.title} | ${sale.category} | ${sale.market} | ${sale.country} | ${sale.link} | ${sale.type} |`
      //   )
      //   .join("\n")}
      // `;
      // }
    })
    .catch((error) => console.error(error));
}
