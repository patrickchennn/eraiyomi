// react
import useGotoHash from "../../hooks/useGotoHash";

// assets
import TOCstyle from "../../assets/TOCstyle";
import testCase from "./test-case.png";

// components/blog
import ParagraphHeading from "../../components/blog/ParagraphHeading";
import HeaderSection from "../../components/blog/HeaderSection";
import {
  TableOfContents,
  TableOfContents2,
} from "../../components/blog/TableOfContents";
import OtherPosts from "../../components/blog/OtherPosts";
import Title from "../../components/blog/Title";
import {
  MyCite,
  MyCitesDesc,
  FootnotesLayout,
} from "../../components/blog/Footnotes";
import ReferenceLayout from "../../components/blog/ReferenceLayout";
import CommentSection from "../../components/blog/CommentSection";
import MyLink from "../../components/blog/MyLink";

import { Article } from "../../../types/Article";

// features/
import { getArticle } from "../../features/articleService";

import { useLayoutEffect, useRef, useState } from "react";
import LikeArticle from "../../components/blog/LikeArticle";


const _217ContainsDuplicate = () => {
  const headingRef = useRef<{ [key: string]: HTMLHeadingElement }>({});
  const footnotesRef = useRef<HTMLElement>();
  interface CitesRef {
    // n is in set of {1,2,3,...}
    // cite_n contains a tuple of the citation DOM reference(index 0, the anchor tag) and the footnote DOM reference(index 1)
    [cite_n: string]: [HTMLAnchorElement, HTMLParagraphElement];
  }
  const citesRef = useRef<CitesRef>({});
  const [articleData, setArticleData] = useState<Article>();

  useLayoutEffect(() => {
    const titleArticleLocal = "217 Contains Duplicate";
    window.document.title = titleArticleLocal;
    (async function () {
      setArticleData(await getArticle(titleArticleLocal));
    })();
  }, []);
  useGotoHash(headingRef, citesRef, articleData);

  const TOCData: JSX.Element = (
    <>
      <div
        className={TOCstyle.parent}
        data-border-color-default="border-indigo-200"
        data-border-color-on-hover="border-indigo-400"
      >
        Soal
      </div>
      <div
        className={TOCstyle.parent}
        data-border-color-default="border-indigo-200"
        data-border-color-on-hover="border-indigo-400"
      >
        Solusi 1, bruteforce (TLE)
      </div>
      <div
        className={TOCstyle.parent}
        data-border-color-default="border-indigo-200"
        data-border-color-on-hover="border-indigo-400"
      >
        Solusi 2, sort
      </div>
      <div
        className={TOCstyle.parent}
        data-border-color-default="border-indigo-200"
        data-border-color-on-hover="border-indigo-400"
      >
        Solusi 3, set
      </div>
      <div
        className={TOCstyle.parent}
        data-border-color-default="border-indigo-200"
        data-border-color-on-hover="border-indigo-400"
      >
        Solusi 4, hashmap
      </div>
    </>
  );
  if (articleData) {
    return (
      <>
        {/* grid */}
        <div className="px-3 py-5 gap-3 relative min-[335px]:grid min-[576px]:grid-cols-5 max-[576px]:px-1">
          {/* other posts/content */}
          <OtherPosts style="p-5 border border-zinc-300 rounded-xl h-fit bg-[#F7F9FA] shadow-inner dark:bg-zinc-900 dark:border-stone-800 max-[576px]:hidden" currArticleId={articleData._id}/>

          {/* main content (write here) and header (thumbnail)*/}
          <div className="border border-zinc-300 rounded-xl bg-[#F7F9FA] shadow-md col-span-3 dark:bg-[#050505] dark:border-stone-800 max-[1024px]:col-span-4 max-[576px]:col-span-full">
            {/* header (thumbnail) */}
            <HeaderSection />

            {/* main content (write here)*/}
            <main className="px-16 py-8 transition-all duration-250 ease-[linear] max-[1024px]:px-14 max-[576px]:px-8">
              <Title
                titlePage={articleData.titleArticle}
                miscInfo={{
                  date: articleData.publishedDate,
                  wordCount: 743,
                  author: articleData.author,
                  readingTime: "5 min",
                  keywords: articleData.keywords,
                }}
              />

              <div className="pb-5">
                <p>
                  Pada soal leetcode kali ini kita akan menyelesaikan soal <MyLink to="https://leetcode.com/problems/contains-duplicate/description/" txt="no
                  217. Contains Duplicate"/>, yang termasuk kategori array,
                  hashtable/hashmap, dan sliding window. Hashmap, hashset, sort,
                  dan pengulangan adalah pengetahuan yang perlu dikuasai untuk
                  mengerti semua solusi yang diberikan dibawah. Semuanya
                  bersifat sederhana jadi tidak perlu mengetahui secara mendalam untuk setiap konsep yang baru saja disebut.
                </p>
              </div>

              {/* table of content (<768px)*/}
              <TableOfContents2 headingRef={headingRef} TOCData={TOCData} />

              <div className="pb-5">
                <ParagraphHeading
                  headingType="h2"
                  headingName="Soal"
                  headingRef={headingRef}
                />
                <div>
                  <p>
                    Diberikan sebuah array of integer (nums), return true jika
                    ada elemen yang setidaknya duplikat dua (dobel), dan
                    sebaliknya, return false jika tidak ada elemen yang
                    duplikat. Simak dibawah berikut sebagai contoh:
                  </p>
                </div>
                <br />

                <div>
                  <p>Input: nums = [1, 2, 3,1]</p>
                  <p>Output: true</p>
                  <p>
                    Penjelasan: Terlihat pada nums[0] dan nums[3] memuat elemen
                    yang duplikat yakni 1.
                  </p>
                </div>
                <br />

                <div>
                  <p>I: nums = [1, 2, 3, 4]</p>
                  <p>O: false</p>
                  <p>P: Tidak ada elemen yang duplikat pada array tersebut.</p>
                </div>
                <br />

                <div>
                  <p>
                    I: <img src={testCase} alt="test case" />
                  </p>
                  <p>O: true</p>
                  <p>
                    P: Terlihat pada nums[0]==nums[1]==nums[2] memuat elemen
                    yang duplikat. Begitu pula dengan nums[3]==nums[4] dan
                    nums[5]==nums[8]. Jika melihat kembali pada soal, diketahui
                    bahwa “jika ada elemen yang setidaknya duplikat dua, maka,
                    return true (…)”. Jadi, cukup sampai pada nums[0] dan
                    nums[1] setelah itu dapat secara langsung return karena dua
                    elemen itu jelas merupakan sebuah duplikat. Tidak perlu
                    mengecek untuk elemen elemen selanjutnya seperti nums[3] dan
                    nums[4], begitu pula nums[0] dan nums[2].
                  </p>
                </div>
              </div>

              <div className="pb-5">
                <ParagraphHeading
                  headingType="h2"
                  headingName="Solusi 1, bruteforce (TLE)"
                  headingRef={headingRef}
                />
                <div>
                  <p>
                    Time Complexity: O(n<sup>2</sup>)
                  </p>
                  <p>Space Complexity: O(1)</p>
                </div>
                <br />

                <p>
                  Solusi yang seharusnya dipikirkan oleh orang-orang adalah
                  solusi bruteforce karena solusi ini memanglah yang paling
                  sederhana dan intuitif, bila tidak, itu juga tidaklah menjadi
                  masalah karena di soal anda akan mengetahuinya juga. Tetapi
                  untuk solusi ini semua soal yang diberikan dari 70 hanya 65
                  yang lolos. Alasan tidak lolos karena time limit exceeded,
                  artinya melewati batas waktu yang diberikan.
                </p>

                <pre>
                  {`
                    for( i=0; i<nums.length; i++ )
                      for( j=i+1; nums.length; j++ )
                        if( nums[i] == nums[j] ) return true
                    return false
                  `}

                </pre>
              </div>

              <div className="pb-5">
                <ParagraphHeading
                  headingType="h2"
                  headingName="Solusi 2, sort"
                  headingRef={headingRef}
                />

                <div>
                  <p>TC: O(n log n)</p>
                  <p>
                    SC: bila mana anda menggunakan library sort dari c++, maka
                    SC memakan sebesar log(n) karena fungsi sort c++
                    berlandaskan dari intro sort.
                  </p>
                </div>
                <br />

                <pre>
                  {`
                    sort(nums)
                    for( i=1; i<nums.length; i++ ):
                      if( nums[i-1]==nums[i] ): return true
                    return false
                  `}
                </pre>

                <p>
                  Tidak masalah bilamana anda mau menyortir nums dari yang
                  elemen yang terbesar ke terkecil (descending), atau sebaliknya
                  (ascending). Karena pada akhirnya elemen yang duplikat pasti
                  akan saling bersebelahan (lihat contoh dibawah) dan inilah
                  yang menjadi alasan mengapa solusi sort berhasil.
                </p>
                <pre>
                  {`
                    a=[1,9,2,1,3] 
                    b=[3,12,3,12,3,41,2,412,32,412]

                    // output: [1,1,2,3,9]
                    sort(a, ascending) 

                    // output: [2,3,3,3,12,12,32,41,412,412]
                    sort(b,ascending) 

                    // output: [9,3,2,1,1]
                    sort(a, descending) 

                    // output: [412,412,41,32,12,12,3,3,3,2]
                    sort(b, descending) 
                    `}
                </pre>
              </div>

              <div className="pb-5">
                <ParagraphHeading
                  headingType="h2"
                  headingName="Solusi 3, set"
                  headingRef={headingRef}
                />
                <p>
                  Kontainer set adalah kontainer yang didalamnya tidak boleh
                  terdapat elemen yang duplikat. Misalkan, jika set(1,2,3,3),
                  maka outputnya akan menjadi 1,2,3. Disini kita akan
                  memanfaatkan fungsi set untuk mendeteksi adanya duplikat dalam
                  sebuah array atau tidak dengan membandingkan banyaknya elemen
                  kontainer array yang sudah dikonversikan ke kontainer set dan
                  kontainer array yang original. Jika banyaknya elemen pada
                  kontainer set lebih sedikit dari pada kontainer array, maka,
                  sudah dipastikan sudah ada duplikat pada array tersebut karena
                  sebagaimana diketahui fungsi set akan membantu dalam
                  pendeteksian elemen yang duplikat dan akan dilenyapkan elemen
                  duplikat tersebut.
                </p>
                <br />
                <pre>
                  {`return True if(len(set(nums))<len(nums)) else False`}
                </pre>
                <br />
                <p>Atau</p>
                <pre>
                  {`
                      D = set()
                      for num in nums:
                          if(num not in D):
                              D.add(num)
                          else:
                              return True
                      return False
                    `}
                </pre>
              </div>

              <div className="pb-5">
                <ParagraphHeading
                  headingType="h2"
                  headingName="Solusi 4, hashmap"
                  headingRef={headingRef}
                />
                <p>TC: O(n)</p>
                <p>
                  SC: O(n), karena kita membuat kontainer baru dengan banyak
                  jumlahnya setidaknya sebesar n (worst case).
                </p>
                <br />
                <p>
                  Pada dasarya solusi keempat ini konsep dasarnya sama saja
                  dengan solusi yang ketiga.
                </p>
                <pre>
                  {`
                    D = {}
                    for num in nums:
                        if(num not in D):
                            D[num] = 1
                        else:
                            return True
                    return False
                  `}
                </pre>
              </div>

              <hr />
              <LikeArticle
                articleId={articleData._id}
                articleDataState={[articleData, setArticleData]}
              />
            </main>
          </div>

          {/* table of content (>1024px)*/}
          <TableOfContents headingRef={headingRef} TOCData={TOCData} />

          {/* commentary */}
          <CommentSection
            style="mb-5 px-16 py-8 border border-zinc-300 rounded-3xl h-fit bg-white col-start-2 col-span-full dark:bg-zinc-900 max-[1024px]:px-14 max-[576px]:px-8 min-[1024px]:col-start-2 min-[1024px]:col-span-3"
            articleId={articleData._id}
            initComments={articleData.comments}
          />
        </div>
      </>
    );
  }
};

export default _217ContainsDuplicate;
