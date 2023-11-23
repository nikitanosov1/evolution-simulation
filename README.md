# Математическое моделирование модели "Хищник-Охотник"
Проект доступен по [ссылке](https://nikitanosov1.github.io/evolution-simulation/)
## Локальный запуск
```
npm i
npm run dev
```
## Базовая математическая модель 
![image](https://github.com/nikitanosov1/evolution-simulation/assets/71886485/74ff07eb-2a5f-4e79-9523-0d7ca9b6b89d)

## Улучшение математической модели

В качестве улучшения добавлен коэффициент, отвечающий за вероятность побега Хищника от Охотника. То есть если B<sub>ij</sub> < 0, то с какой-то заданной вероятностью слагаемое B<sub>ij</sub>N<sub>i</sub>N<sub>j</sub> не будет учитываться при расчете.

## Скриншоты работы

Без модификации
![image](https://github.com/nikitanosov1/evolution-simulation/assets/71886485/95f80636-359c-41eb-b3da-a1ea6ba9e498)

С модификацией
![image](https://github.com/nikitanosov1/evolution-simulation/assets/71886485/2eec2c09-3245-415e-89c3-948a63c4c4db)

Три популяции
![image](https://github.com/nikitanosov1/evolution-simulation/assets/71886485/af1863ea-4721-4efd-b907-7c5b3d1c9125)





