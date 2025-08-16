import { useEffect, useState } from "react";
import { CommentList } from "../../../admin/Comment/stores/interface";
import commentApi from "../../../admin/Comment/api/commentApi";
import { filterDefault } from "../../../../store/common/constants";
import { Rate, Skeleton } from "antd";
import { UserRound } from "lucide-react";

const CustomerTestimonials = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentList[]>([]);

  useEffect(() => {
    fetchDataList();
  }, []);

  const fetchDataList = async () => {
    setIsLoading(true);
    const res = await commentApi.list({
      ...filterDefault,
      payload: { ...filterDefault.payload, pageSize: 3 },
    });
    setIsLoading(false);
    if (res?.data) setComments(res?.data as CommentList[]);
    else setComments([]);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Khách hàng của chúng tôi nói gì
          </h2>
          <p className="text-xl text-gray-700">
            Hãy lắng nghe những người đã tìm thấy mùi hương hoàn hảo của mình
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              {[...Array(3)].map((_x, idx) => (
                <Skeleton.Node
                  active={isLoading}
                  key={idx}
                  style={{ width: "100%", height: 170 }}
                />
              ))}
            </>
          ) : (
            <>
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-md space-y-4"
                >
                  <div className="flex items-center space-x-1">
                    <Rate allowHalf defaultValue={comment.rate ?? 5} disabled />
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    "{comment.comment}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        <UserRound />
                      </span>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {comment.userName}
                      </p>
                      <p className="text-sm text-gray-600">Đã xác minh</p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
