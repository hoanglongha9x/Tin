import { Problem } from "../types";

export const CURATED_PROBLEMS: Problem[] = [
  {
    id: "p1",
    title: "Tính tiền điện bậc thang THPT",
    grade: "Lớp 10",
    category: "python",
    difficulty: "Dễ",
    description: "Nhập vào số kWh điện tiêu thụ của một gia đình trong tháng (x > 0). Hãy viết chương trình tính tổng số tiền điện phải trả theo quy tắc bậc thang:\n- Dưới hoặc bằng 50 kWh: 1,800 VNĐ/kWh.\n- Từ 51 đến 100 kWh: 2,000 VNĐ/kWh cho lượng tiêu thụ vượt quá 50.\n- Trên 100 kWh: 2,500 VNĐ/kWh cho lượng tiêu thụ vượt quá 100.",
    inputFormat: "Một số nguyên dương x là số kWh điện.",
    outputFormat: "Một số nguyên là tổng số tiền điện phải trả (đơn vị VNĐ).",
    sampleInput: "75",
    sampleOutput: "140000",
    socraticQuestion: "Em hãy cho biết với 75 kWh tiêu thụ, có bao nhiêu kWh tính theo giá bậc 1 (1,800đ) và bao nhiêu kWh tính theo giá bậc 2 (2,000đ)?",
    hintSteps: [
      "Xác định bài toán cần bao nhiêu trường hợp điều kiện (`if-elif-else`).",
      "Tính số kWh thuộc từng bậc thay vì nhân toàn bộ số x với một đơn giá.",
      "Thử viết biểu thức toán học cho trường hợp x = 75 trước khi chuyển sang code."
    ],
    starterCode: {
      python: `# Viết code Python tính tiền điện tại đây\nx = int(input())\n# Hãy bắt đầu bằng cách kiểm tra điều kiện x...\n`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int x;\n    cin >> x;\n    // Hãy chia các trường hợp x...\n    return 0;\n}\n`
    }
  },
  {
    id: "p2",
    title: "Kiểm tra số nguyên tố & Tối ưu hóa",
    grade: "Lớp 10",
    category: "python",
    difficulty: "Trung bình",
    description: "Cho số nguyên dương N (2 <= N <= 10^9). Kiểm tra xem N có phải là số nguyên tố hay không.",
    inputFormat: "Một số nguyên N.",
    outputFormat: "In 'YES' nếu N là số nguyên tố, ngược lại in 'NO'.",
    sampleInput: "29",
    sampleOutput: "YES",
    socraticQuestion: "Định nghĩa số nguyên tố là gì? Nếu duyệt ước số từ 2 đến N-1 sẽ chạy rất chậm với N = 10^9, em có thể dừng duyệt sớm ở đâu?",
    hintSteps: [
      "Liệt kê các ước số của một số (ví dụ 36 có các cặp ước: (1,36), (2,18), (3,12), (4,9), (6,6)).",
      "Em nhận thấy gì về điểm cân bằng giữa các cặp ước số này?",
      "Căn bậc hai sqrt(N) giúp ích gì cho việc giảm số lần lặp?"
    ],
    starterCode: {
      python: `import math\n\ndef is_prime(n):\n    if n < 2:\n        return False\n    # Em hãy thêm vòng lặp kiểm tra ước số đến math.isqrt(n)...\n    return True\n\nn = int(input())\nif is_prime(n):\n    print("YES")\nelse:\n    print("NO")\n`,
      cpp: `#include <iostream>\n#include <cmath>\nusing namespace std;\n\nbool isPrime(long long n) {\n    if (n < 2) return false;\n    // Em thử hoàn thiện vòng lặp kiểm tra ở đây...\n    return true;\n}\n\nint main() {\n    long long n;\n    cin >> n;\n    if (isPrime(n)) cout << "YES";\n    else cout << "NO";\n    return 0;\n}\n`
    }
  },
  {
    id: "p3",
    title: "Mảng 1 chiều - Tìm dãy con tăng dài nhất",
    grade: "Lớp 11",
    category: "algo",
    difficulty: "Khó",
    description: "Cho mảng A gồm N số nguyên (1 <= N <= 1000). Tìm độ dài của dãy con liên tiếp tăng dần dài nhất trong mảng.",
    inputFormat: "Dòng 1 chứa số nguyên N.\nDòng 2 chứa N số nguyên phân tách bởi khoảng trắng.",
    outputFormat: "Một số nguyên duy nhất là độ dài dãy con liên tiếp tăng dài nhất.",
    sampleInput: "6\n1 2 1 4 5 6",
    sampleOutput: "4",
    socraticQuestion: "Trong ví dụ trên (1 2 1 4 5 6), các dãy con tăng liên tiếp là gì? Dãy nào dài nhất?",
    hintSteps: [
      "Khởi tạo biến đếm độ dài dãy hiện tại = 1 và biến độ dài cực đại = 1.",
      "Duyệt mảng từ phần tử thứ 2: So sánh A[i] với A[i-1].",
      "Nếu A[i] > A[i-1] thì độ dài dãy tăng hiện tại thay đổi thế nào? Ngược lại nếu không tăng thì reset về bao nhiêu?"
    ],
    starterCode: {
      python: `n = int(input())\na = list(map(int, input().split()))\n\n# Khởi tạo biến max_len và current_len\n# Duyệt qua mảng a...\n`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for(int i = 0; i < n; i++) cin >> a[i];\n    \n    // Viết thuật toán tìm dãy con liên tiếp tăng dài nhất...\n    return 0;\n}\n`
    }
  },
  {
    id: "p4",
    title: "CSDL Quản lý Học sinh & Điểm số (SQL)",
    grade: "Lớp 12",
    category: "sql",
    difficulty: "Trung bình",
    description: "Cho CSDL Quản lý trường học gồm 2 bảng:\n- HOCSINH(MaHS, HoTen, Lop, NgaySinh)\n- DIEM(MaHS, MaMon, DiemTB)\nViết câu lệnh SQL để hiển thị HoTen, Lop và DiemTB của tất cả học sinh có DiemTB >= 8.0 môn 'Tin hoc'.",
    inputFormat: "Sơ đồ CSDL HOCSINH và DIEM.",
    outputFormat: "Câu lệnh SELECT đúng chuẩn SQL.",
    sampleInput: "HOCSINH(MaHS: 'HS01', HoTen: 'Nguyễn Văn A', Lop: '12A1')",
    sampleOutput: "SELECT HOCSINH.HoTen, HOCSINH.Lop, DIEM.DiemTB FROM ...",
    socraticQuestion: "Để lấy dữ liệu nằm ở 2 bảng HOCSINH và DIEM cùng lúc, em cần dùng từ khóa SQL nào để kết nối chúng lại?",
    hintSteps: [
      "Xác định trường thông tin chung (Khóa chính - Khóa ngoại) giữa 2 bảng để kết nối.",
      "Sử dụng mệnh đề INNER JOIN ... ON ...",
      "Thêm mệnh đề WHERE để lọc điều kiện môn 'Tin hoc' và DiemTB >= 8.0."
    ],
    starterCode: {
      sql: `-- Hãy viết câu lệnh SQL SELECT kết nối 2 bảng HOCSINH và DIEM\nSELECT HOCSINH.HoTen, HOCSINH.Lop, DIEM.DiemTB\nFROM HOCSINH\nJOIN DIEM ON ...\nWHERE ...\n`
    }
  },
  {
    id: "p5",
    title: "Thuật toán Tìm kiếm Nhị phân (Binary Search)",
    grade: "Lớp 11",
    category: "cpp",
    difficulty: "Trung bình",
    description: "Cho một dãy A đã được sắp xếp tăng dần gồm N phần tử và số nguyên X. Hãy tìm vị trí (chỉ số 0-based) của X trong mảng A bằng thuật toán Tìm kiếm Nhị phân. Nếu không tìm thấy in -1.",
    inputFormat: "Dòng 1: N và X\nDòng 2: N số nguyên đã sắp xếp.",
    outputFormat: "Chỉ số (0-based) của phần tử X trong mảng, hoặc -1 nếu không tìm thấy.",
    sampleInput: "5 7\n1 3 5 7 9",
    sampleOutput: "3",
    socraticQuestion: "Tại sao thuật toán Tìm kiếm Nhị phân bắt buộc mảng phải ĐÃ SẮP XẾP? Khi so sánh X với phần tử ở giữa (mid), nếu X < A[mid] em sẽ loại bỏ nửa nào của mảng?",
    hintSteps: [
      "Khởi tạo 2 con trỏ `left = 0` và `right = N - 1`.",
      "Tính `mid = (left + right) // 2`.",
      "Điều chỉnh `left` hoặc `right` dựa trên việc so sánh A[mid] với X."
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint binarySearch(const vector<int>& a, int x) {\n    int left = 0, right = a.size() - 1;\n    while(left <= right) {\n        int mid = left + (right - left) / 2;\n        // Kiểm tra A[mid] với x...\n    }\n    return -1;\n}\n\nint main() {\n    int n, x;\n    cin >> n >> x;\n    vector<int> a(n);\n    for(int i = 0; i < n; i++) cin >> a[i];\n    cout << binarySearch(a, x);\n    return 0;\n}\n`,
      python: `def binary_search(a, x):\n    left, right = 0, len(a) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        # Hoàn thiện logic nhị phân tại đây...\n    return -1\n`
    }
  }
];
