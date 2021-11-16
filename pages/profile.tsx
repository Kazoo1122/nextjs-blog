import { Layout } from '../components/Layout';

export default function Profile(props: any) {
  return (
    <Layout pageTitle='PROFILE'>
      <div className='introduction'>
        <h3>大平　和正　- Kazumasa Ohira -</h3>
        <p>
          新卒で小売業界に入社してから、紆余曲折を経てシステム開発に従事。
          <br />
          今まで大嫌いだった勉強が30代になってから楽しくなり、
          <br />
          大好きだったテレビゲームを押し入れに突っ込んでIT技術の習得に没頭中。
          <br />
          遅咲き(？)中途エンジニアとして、日々の学びを綴っていきます。
        </p>
      </div>

      <div className='skill'>
        <h4>SKILL</h4>
        <div className='langrage'>
          <h5>LANGRAGE</h5>
          <p>JavaScript, TypeScript, Python, SQL, VBA, VBS</p>
        </div>

        <div className='tool'>
          <h5>TOOL</h5>
          <p>RPA(WinActor, PowerAutomate, Robopat), Adobe XD, Premiere Pro</p>
        </div>
      </div>

      <div className='favorite'>
        <h4>FAVORITE</h4>
        <p>Guitar, Running</p>
      </div>
    </Layout>
  );
}
