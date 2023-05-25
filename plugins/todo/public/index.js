const { useCallback, useState } = PreactHooks;

window.plugins.register('sidebar', (client) => () => {
  const [time, setTime] = useState('Click to proble time');
  const click = useCallback(async () => {
    const {data:[time]} = await client.req({type: 'system:time'});
    setTime(time.time);
  }, [client]);

  return (<div onClick={click}>{time}</div>);
});
