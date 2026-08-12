# solich-events

Dữ liệu ngày lễ, ngày kỷ niệm và lịch nghỉ/làm bù công khai cho Sổ Lịch.

## Bắt đầu

Điểm vào cấp quốc gia của mỗi nước là `data/v1/<country>/manifest.json`. Ví dụ
Việt Nam là `data/v1/VN/manifest.json`; Nhật Bản là `data/v1/JP/manifest.json`.
Khi cần lịch vùng/tỉnh, dữ liệu nằm dưới `data/v1/<country>/subdivisions/` với
mã ISO 3166-2, ví dụ `data/v1/US/subdivisions/US-CA/`.

- `official/catalog.json`: các ngày lễ có quy tắc ổn định.
- `observances/catalog.json`: ngày kỷ niệm, không mặc định là ngày nghỉ.
- `official/overrides/<year>.json`: lịch nghỉ thực tế, nghỉ bù và làm bù được
  công bố theo từng năm.
- `international/observances/catalog.json`: các observance dùng chung; mỗi mục
  khai báo `applicability` để chỉ hiện với quốc gia phù hợp.

Xem [data model](docs/data-model.md) để biết cách gộp ba lớp dữ liệu, và
[source policy](docs/sources.md) về điều kiện phát hành dữ liệu official.

Mọi JSON công khai đều phải được kiểm tra với schema tương ứng trong
`schema/v1/` trước khi ứng dụng sử dụng.
