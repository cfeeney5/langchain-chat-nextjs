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
            sale["startAt"].mapValue.fields.timestamp.timestampValue;

          let beginEndAt = "";
          if (sale && sale["beginEndAt"]) {
            beginEndAt =
              sale["beginEndAt"].mapValue.fields.timestamp.timestampValue;
          }
          const isToday = sale["isToday"].booleanValue;
          const isTomorrow = sale["isTomorrow"].booleanValue;
          const isLive = sale["isLive"].booleanValue;
          const saleType = sale["type"].stringValue;

          let saleSummaryText = "";
          if (saleType == "sale") {
            saleSummaryText = `- ${title} (${category}) in ${location} from ${startAt} to ${beginEndAt}\n`;
          } else {
            saleSummaryText = `- ${title} (TIMED) in ${location} at ${startAt}\n`;
          }

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
      summaryText += "# Today's Sales:\n";
      summaryText += todaysSales.join("\n");
      summaryText += "\n\n";

      if (tomorrowsSales.length > 0) {
        summaryText += "# Tomorrows Sales:\n";
        summaryText += tomorrowsSales.join("\n");
      } else {
        summaryText += "No sales tomorrow";
      }

      if (remainingSales.length > 0) {
        summaryText += "\n\n";
        summaryText += "# Other Sales:\n";
        summaryText += remainingSales.join("\n");
      }

      console.log(summaryText);

      res.status(200).json({ result: summaryText });
    });
}
