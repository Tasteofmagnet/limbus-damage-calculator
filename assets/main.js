
import React, { useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

function LimbusDamageCalculator() {
  const [basePower, setBasePower] = useState(0);
  const [atkLevel, setAtkLevel] = useState(0);
  const [coins, setCoins] = useState([{ power: 0, prob: 1.0, bonus: 0 }]);
  const [commonBonus, setCommonBonus] = useState(0);
  const [critBonus, setCritBonus] = useState(0);
  const [breath, setBreath] = useState(0);

  const critRate = Math.min(breath * 0.05, 1);
  const atkBonus = atkLevel / (25 + Math.abs(atkLevel));
  const totalBonus = commonBonus / 100 + atkBonus;

  const damageMultiplier =
    (1 - critRate) * (1 + totalBonus) +
    critRate * (1 + totalBonus + critBonus / 100);
  const resistMultiplier = (1 - critRate) * 1 + critRate * 1.2;

  let expectedPower = basePower;
  for (let i = 0; i < coins.length; i++) {
    const { power, prob, bonus } = coins[i];
    const coinBonus = bonus / 100;
    const coinExpected = power * prob * (1 + coinBonus);
    expectedPower += coinExpected;
  }

  const expectedDamage = expectedPower * damageMultiplier * resistMultiplier;

  const updateCoin = (index, key, value) => {
    const newCoins = [...coins];
    newCoins[index][key] = parseFloat(value);
    setCoins(newCoins);
  };

  const addCoin = () => {
    setCoins([...coins, { power: 0, prob: 1.0, bonus: 0 }]);
  };

  return (
    React.createElement('div', { style: { maxWidth: 600, margin: "0 auto", padding: 20 } }, [
      React.createElement('h1', { style: { fontWeight: "bold", fontSize: 24 } }, '림버스 피해량 기대값 계산기'),

      React.createElement('label', null, '기본 위력'),
      React.createElement('input', { type: "number", value: basePower, onChange: e => setBasePower(+e.target.value) }),

      React.createElement('label', null, '공격레벨'),
      React.createElement('input', { type: "number", value: atkLevel, onChange: e => setAtkLevel(+e.target.value) }),

      React.createElement('label', null, '코인 정보'),
      ...coins.map((coin, index) =>
        React.createElement('div', { key: index }, [
          React.createElement('input', { type: "number", placeholder: "코인 위력", value: coin.power, onChange: e => updateCoin(index, 'power', e.target.value) }),
          React.createElement('input', { type: "number", step: "0.01", placeholder: "확률", value: coin.prob, onChange: e => updateCoin(index, 'prob', e.target.value) }),
          React.createElement('input', { type: "number", placeholder: "피해량 증가(%)", value: coin.bonus, onChange: e => updateCoin(index, 'bonus', e.target.value) })
        ])
      ),
      React.createElement('button', { onClick: addCoin }, '+ 코인 추가'),

      React.createElement('label', null, '전체 피해량 증가(%)'),
      React.createElement('input', { type: "number", value: commonBonus, onChange: e => setCommonBonus(+e.target.value) }),

      React.createElement('label', null, '크리 시 피해량 증가(%)'),
      React.createElement('input', { type: "number", value: critBonus, onChange: e => setCritBonus(+e.target.value) }),

      React.createElement('label', null, '호흡 수치'),
      React.createElement('input', { type: "number", value: breath, onChange: e => setBreath(+e.target.value) }),

      React.createElement('div', { style: { fontWeight: "bold", marginTop: 20 } },
        `기대 피해량: ${expectedDamage.toFixed(2)}`
      )
    ])
  );
}

const root = createRoot(document.getElementById("root"));
root.render(React.createElement(LimbusDamageCalculator));
