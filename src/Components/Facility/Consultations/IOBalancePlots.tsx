import moment from "moment";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { statusType, useAbortableEffect } from "../../../Common/utils";
import { dailyRoundsAnalyse } from "../../../Redux/actions";
import { LinePlot } from "./components/LinePlot";

export const IOBalancePlots = (props: any) => {
  const { consultationId } = props;
  const dispatch: any = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [results, setResults] = useState({});
  const limit = 14;

  const fetchDailyRounds = useCallback(
    async (status: statusType) => {
      setIsLoading(true);
      const res = await dispatch(
        dailyRoundsAnalyse(
          {
            limit,
            offset,
            fields: [
              "infusions",
              "iv_fluids",
              "feeds",
              "total_intake_calculated",
              "total_output_calculated",
            ],
          },
          { consultationId }
        )
      );
      if (!status.aborted) {
        if (res && res.data) {
          setResults(res.data);
        }
        setIsLoading(false);
      }
    },
    [consultationId, dispatch, offset]
  );

  useAbortableEffect((status: statusType) => {
    fetchDailyRounds(status);
  }, []);

  const dates = Object.keys(results)
    .map((p: string) => moment(p).format("LLL"))
    .reverse();

  const yAxisData = (name: string) => {
    return Object.values(results)
      .map((p: any) => p[name])
      .reverse();
  };

  return (
    <div className="grid grid-row-1 md:grid-cols-2 gap-4">
      <div className="pt-4 px-4 bg-white border rounded-lg shadow">
        <LinePlot
          title="Total Intake"
          name="Total Intake"
          xData={dates}
          yData={yAxisData("total_intake_calculated")}
        />
      </div>

      <div className="pt-4 px-4 bg-white border rounded-lg shadow">
        <LinePlot
          title="Total Output"
          name="Total Output"
          xData={dates}
          yData={yAxisData("total_output_calculated")}
        />
      </div>

      <div className="pt-4 px-4 bg-white border rounded-lg shadow">
        <h3 className="text-lg">Infusions:</h3>
        {Object.entries(results).map((obj: any) => {
          if (obj[1].infusions && obj[1].infusions.length > 0) {
            return (
              <div>
                <h4 className="text-sm">- {moment(obj[0]).format("LLL")}</h4>
                <div className="px-5 text-sm">
                  {obj[1].infusions.map((o: any) => (
                    <div>
                      {o.name} - {o.quantity}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        })}
      </div>

      <div className="pt-4 px-4 bg-white border rounded-lg shadow">
        <h3 className="text-lg">IV Fluids:</h3>
        {Object.entries(results).map((obj: any) => {
          if (obj[1].iv_fluids && obj[1].iv_fluids.length > 0) {
            return (
              <div>
                <h4 className="text-sm">- {moment(obj[0]).format("LLL")}</h4>
                <div className="px-5 text-sm">
                  {obj[1].iv_fluids.map((o: any) => (
                    <div>
                      {o.name} - {o.quantity}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        })}
      </div>

      <div className="pt-4 px-4 bg-white border rounded-lg shadow">
        <h3 className="text-lg">Feeds:</h3>
        {Object.entries(results).map((obj: any) => {
          if (obj[1].feeds && obj[1].feeds.length > 0) {
            return (
              <div>
                <h4 className="text-sm">- {moment(obj[0]).format("LLL")}</h4>
                <div className="px-5 text-sm">
                  {obj[1].feeds.map((o: any) => (
                    <div>
                      {o.name} - {o.quantity}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
