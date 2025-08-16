import { deliveryData } from "../store/constants";

const DeliveryProcess = () => {
  return (
    <section className="py-16 bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Quy trình giao hàng của chúng tôi
          </h2>
          <p className="text-xl text-gray-700">
            Từ đơn hàng đến tận nhà bạn chỉ với 4 bước đơn giản
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {deliveryData.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto">
                <step.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliveryProcess;
