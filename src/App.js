import "./App.css";
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";
import { useEffect, useState } from "react";
import { Table } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "display_name",
    sorter: (a, b) => (a.display_name - b.display_name ? 1 : -1),
    width: "30%",
  },
  {
    title: "Last Price",
    dataIndex: "tickQuote",
    sorter: (a, b) => a.tickQuote - b.tickQuote,
    width: "30%",
    render: (value, record) => {
      const isPositive = value > record.changes;
      const cellStyle = {
        color: isPositive ? "green" : "red",
        fontWeight: isPositive ? "bold" : "normal",
      };
      return value ? <span style={cellStyle}>{value}</span> : 0;
    },
  },
  {
    title: "24h Change",
    dataIndex: "changes",
    sorter: (a, b) => a.changes - b.changes,
    width: "30%",
    render: (value) => (value ? value : 0),
  },
];

const app_id = 1089;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?l=EN&app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [symbols, setSymbols] = useState([]);
  const [oldPrices, setOldPrices] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const sendTicksRequest = async (symbol) => {
    try {
      await api.ticks(symbol.symbol);
      connection.addEventListener("message", handleTicksResponse);
    } catch (error) {
      console.warn("sendTicksRequest: Market is closed", error);
      connection.removeEventListener("message", handleTicksResponse, false);
      await api.disconnect();
    }
  };
  const handleTicksResponse = (res) => {
    try {
      const tck = JSON.parse(res.data);
      let newData = {};
      if (tck.msg_type === "tick") {
        const symbol = tck.tick.symbol;
        const existingData = oldPrices.find((item) => item.symbol === symbol);
        if (existingData) {
          newData = {
            ...existingData,
            tickQuote: tck.tick.quote,
          };
        } else {
          const symbolData = oldPrices.find((item) => item.symbol === symbol);
          if (symbolData) {
            newData = {
              symbol: symbolData.symbol,
              display_name: symbolData.display_name,
              tickQuote: tck.tick.quote,
              changes: existingData.changes,
            };
          }
        }
      }
      if (Object.keys(newData).length > 0) {
        setData((prevData) => {
          const updatedData = prevData.map((item) =>
            item.symbol === newData.symbol ? newData : item
          );
          return updatedData;
        });
      }
    } catch (error) {
      console.log("market is closed", error);
      connection.removeEventListener("message", handleTicksResponse, false);
      api.disconnect();
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const activeSymbolResponse = await api.activeSymbols({
          active_symbols: "brief",
        });
        if (activeSymbolResponse.error) {
          return;
        }
        const sortedActiveSymbols = activeSymbolResponse.active_symbols.filter(
          (x) => x.symbol_type === "forex"
        );
        setSymbols(sortedActiveSymbols);
        setData(sortedActiveSymbols);
        setLoading(false);
        setTableParams((prevParams) => ({
          ...prevParams,
          pagination: {
            ...prevParams.pagination,
            total: sortedActiveSymbols.length,
          },
        }));
        return sortedActiveSymbols;
      } catch (error) {
        console.warn("fetchData:", error);
        return error;
      }
    };
    fetchData().then(async (sym) => {
      try {
        const newData = [];
        sym.forEach(async (symbol) => {
          const th = await api.ticksHistory({
            ticks_history: symbol.symbol,
            adjust_start_time: 1,
            count: 2,
            end: "latest",
            start: 1,
            style: "ticks",
          });
          newData.push({
            symbol: symbol.symbol,
            display_name: symbol.display_name,
            changes: th?.history?.prices[0],
          });
        });
        setOldPrices(newData);
      } catch (error) {
        console.warn("fetchData:", error);
      }
    });
  }, []);

  useEffect(() => {
    if (symbols.length > 0) {
      symbols.forEach((symbol) => {
        sendTicksRequest(symbol);
      });
    }
  }, [symbols]);

  return (
    <div className="App">
      <header className="App-header">Live Pricing</header>
      <Table
        columns={columns}
        rowKey={(record) => record.symbol}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default App;
