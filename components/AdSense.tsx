import { useEffect } from 'react';

/**
 * Google AdSenseのコンポーネント
 */
const AdSense = () => {
  useEffect(() => {
    if (!window) {
      return;
    } // SSR 処理中は skip
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  });
  return (
    <>
      {/*<!-- 帯広告 -->*/}
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client='ca-pub-5349483131357615'
        data-ad-slot='3710510066'
        data-ad-format='auto'
        data-full-width-responsive='true'
      ></ins>
    </>
  );
};

export { AdSense };
