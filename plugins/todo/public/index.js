const { useCallback, useState } = PreactHooks;

plugins.register('sidebar', (client) => function TimeButton() {
  const [time, setTime] = useState('Click to proble time');
  const click = useCallback(async () => {
    const {data: [time]} = await client.req({type: 'system:time'});
    setTime(time.time);
  }, []);

  return (<div onClick={click}>{time}</div>);
});
