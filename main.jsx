import React, { useState } from "react";
import { createRoot } from "react-dom/client";

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
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1 style={{ fontWeight: "bold", fontSize: 24 }}>림버스 피해량 기대값 계산기</h1>

      <label>기본 위력</label>
      <input type="number" value={basePower} onChange={e => setBasePower(+e.target.value)} />

      <label>공격레벨</label>
      <input type="number" value={atkLevel} onChange={e => setAtkLevel(+e.target.value)} />

      <label>코인 정보 (순서대로 누적)</label>
      {coins.map((coin, index) => (
        <div key={index}>
          <input type="number" placeholder="코인 위력" value={coin.power} onChange={e => updateCoin(index, 'power', e.target.value)} />
          <input type="number" step="0.01" placeholder="앞면 확률" value={coin.prob} onChange={e => updateCoin(index, 'prob', e.target.value)} />
          <input type="number" placeholder="피해량 증가 (%)" value={coin.bonus} onChange={e => updateCoin(index, 'bonus', e.target.value)} />
        </div>
      ))}
      <button onClick={addCoin}>+ 코인 추가</button>

      <label>전체 피해량 증가 (%)</label>
      <input type="number" value={commonBonus} onChange={e => setCommonBonus(+e.target.value)} />

      <label>크리 시 피해량 증가 (%)</label>
      <input type="number" value={critBonus} onChange={e => setCritBonus(+e.target.value)} />

      <label>호흡 수치 (1당 5% 크리 확률)</label>
      <input type="number" value={breath} onChange={e => setBreath(+e.target.value)} />

      <div style={{ fontWeight: "bold", marginTop: 20 }}>
        기대 피해량: {expectedDamage.toFixed(2)}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<LimbusDamageCalculator />);
