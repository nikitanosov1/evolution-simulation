import { ThemeProvider } from "@emotion/react";
import {
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { lightTheme } from "./config/theme";

type Population = {
  amount: number;
  growth: number;
};

const colors = ["#8884d8", "#a5b4fc", "#6366f1", "#2563eb", "#312e81"];

function App() {
  const [numberOfPopulations, setNumberOfPopulations] = useState(2);
  const [coeffs, setCoeffs] = useState<number[][]>(
    new Array(numberOfPopulations)
      .fill(new Array(numberOfPopulations).fill(0.0001))
      .map((row, rowIdx) =>
        row.map((num: number, colIdx: number) => (rowIdx === colIdx ? 0 : num))
      )
  );
  const [simulationStep, setSimulationStep] = useState(1);
  const [populations, setPopulations] = useState<Population[]>(
    new Array(numberOfPopulations)
      .fill(0)
      .map(() => ({ amount: 100, growth: 0.01 }))
  );
  const [simulationDuration, setSimulationDuration] = useState(1000);
  const [data, setData] = useState<Record<string, number>[]>(
    new Array(1).fill(0).map(() => {
      const obj = {
        day: 0,
      } as Record<string, number>;
      for (let i = 0; i < numberOfPopulations; ++i) {
        obj[i] = populations[i]?.amount ?? 100;
      }
      return obj;
    })
  );
  const totalPopulationAmount = useMemo(() => {
    let total = 0;
    for (let i = 0; i < numberOfPopulations; ++i) {
      total += data[data.length - 1][i];
    }
    return total;
  }, [data, numberOfPopulations]);
  const [start, setStart] = useState(false);

  useEffect(() => {
    setPopulations(
      new Array(numberOfPopulations)
        .fill(0)
        .map(() => ({ amount: 100, growth: 0.01 }))
    );
    setCoeffs(
      new Array(numberOfPopulations)
        .fill(new Array(numberOfPopulations).fill(0.0001))
        .map((row, rowIdx) =>
          row.map((num: number, colIdx: number) =>
            rowIdx === colIdx ? 0 : num
          )
        )
    );
  }, [numberOfPopulations]);

  useEffect(() => {
    setData(
      new Array(1).fill(0).map(() => {
        const obj = {
          day: 0,
        } as Record<string, number>;
        for (let i = 0; i < numberOfPopulations; ++i) {
          obj[i] = populations[i]?.amount ?? 100;
        }
        return obj;
      })
    );
  }, [populations, numberOfPopulations]);

  const handleNumberOfPopulationsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNumberOfPopulations(+event.target.value);
    },
    []
  );

  const handleSimulationDurationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSimulationDuration(+event.target.value);
    },
    []
  );

  const handleSimulationStepChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSimulationStep(+event.target.value);
    },
    []
  );

  const getDaysText = (days: number) => {
    if (days === 1) {
      return "день";
    } else if (days >= 2 && days <= 4) {
      return "дня";
    } else {
      return "дней";
    }
  };

  const handleClick = useCallback(() => {
    setStart((p) => !p);
  }, []);

  useEffect(() => {
    let request: number;
    let day = 0;
    const startSimulation = () => {
      if (!start) {
        return;
      }
      if (day > simulationDuration) {
        cancelAnimationFrame(request);
        return;
      }
      setData((p) => {
        const currentData = p[p.length - 1];
        const newData = {
          ...currentData,
          day: currentData.day + simulationStep,
        } as Record<string, number>;
        for (let k = 0; k < simulationStep; ++k) {
          for (let i = 0; i < numberOfPopulations; ++i) {
            const N = newData[i];
            const growth = populations[i].growth;
            let dN = N * growth;
            for (let j = 0; j < numberOfPopulations; ++j) {
              dN += coeffs[i][j] * N * newData[j];
            }
            newData[i] = N + dN;
          }
        }
        return [...p, newData];
      });
      day += simulationStep;
      request = requestAnimationFrame(startSimulation);
    };
    start && startSimulation();

    return () => {
      request && cancelAnimationFrame(request);
    };
  }, [
    simulationDuration,
    numberOfPopulations,
    populations,
    coeffs,
    start,
    simulationStep,
  ]);

  return (
    <ThemeProvider theme={lightTheme}>
      <main
        style={{
          minHeight: "100vh",
        }}
      >
        <Stack
          sx={(theme) => ({
            backgroundColor: theme.palette.background.paper,
          })}
          flexDirection="row"
        >
          <Stack padding={2} gap={1}>
            <Typography alignSelf="center">Параметры симуляции</Typography>

            <TextField
              label="Число популяций"
              type="number"
              id="numberOfPopulations"
              value={numberOfPopulations}
              onChange={handleNumberOfPopulationsChange}
            />

            <TextField
              label="Длительность симуляции"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography>{getDaysText(simulationDuration)}</Typography>
                  </InputAdornment>
                ),
              }}
              id="sumulationDuration"
              type="number"
              value={simulationDuration}
              onChange={handleSimulationDurationChange}
            />

            <TextField
              label="Шаг симуляции"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography>{getDaysText(simulationStep)}</Typography>
                  </InputAdornment>
                ),
              }}
              id="sumulationStep"
              type="number"
              value={simulationStep}
              onChange={handleSimulationStepChange}
            />
            <Button onClick={handleClick} variant="contained" color="primary">
              {start ? "Остановить" : "Начать"}
            </Button>

            <Stack marginTop={1}>
              <Typography alignSelf="center">Состояние симуляции</Typography>
              <Stack justifyContent="space-between" direction="row">
                <Typography fontSize="12px">Общая численность</Typography>
                <Typography fontSize="12px">
                  {totalPopulationAmount.toFixed(2)}
                </Typography>
              </Stack>
              <Stack justifyContent="space-between" direction="row">
                <Typography fontSize="12px">Текущий день</Typography>
                <Typography fontSize="12px">
                  {data[data.length - 1].day}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack padding={2}>
            <Stack flexDirection="row">
              {populations.map((population, index) => (
                <Stack key={index} gap={1} alignItems="center">
                  <Typography>Популяция #{index + 1}</Typography>
                  <TextField
                    label="Численность"
                    type="number"
                    id={`amount${index}`}
                    value={population.amount}
                    onChange={(event) =>
                      setPopulations((p) =>
                        p.map((p, idx) =>
                          idx === index
                            ? {
                                ...p,
                                amount: +event.target.value,
                              }
                            : p
                        )
                      )
                    }
                  />
                  <TextField
                    label="Коэффициент рождаемости"
                    id={`growth${index}`}
                    value={population.growth}
                    onChange={(event) =>
                      setPopulations((p) =>
                        p.map((p, idx) =>
                          idx === index
                            ? {
                                ...p,
                                growth: +event.target.value,
                              }
                            : p
                        )
                      )
                    }
                  />
                </Stack>
              ))}
            </Stack>

            <Stack marginTop={2}>
              <Typography>Матрица взаимодействий популяций</Typography>
              {coeffs.map((row, rowIdx) => (
                <Stack key={rowIdx} direction="row">
                  {row.map((coeff, colIdx) => (
                    <TextField
                      key={`${rowIdx}${colIdx}`}
                      onChange={(e) =>
                        setCoeffs((p) =>
                          p.map((row, rowIndex) =>
                            row.map((num, colIndex) =>
                              rowIdx === rowIndex && colIdx === colIndex
                                ? Number(e.target.value)
                                : num
                            )
                          )
                        )
                      }
                      type="number"
                      value={coeff}
                    />
                  ))}
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>

        <Stack
          sx={(theme) => ({
            backgroundColor: theme.palette.background.paper,
          })}
        >
          <ResponsiveContainer width="95%" height={400}>
            <LineChart
              width={1000}
              height={300}
              data={data}
              margin={{
                top: 30,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend
                wrapperStyle={{
                  fontSize: 20,
                  paddingTop: "40px",
                }}
              ></Legend>
              {populations.map((_, index) => (
                <Line
                  name={`Популяция #${index + 1}`}
                  key={index}
                  type="monotone"
                  dataKey={index}
                  dot={false}
                  stroke={colors[index % colors.length]}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Stack>
      </main>
    </ThemeProvider>
  );
}

export default App;
