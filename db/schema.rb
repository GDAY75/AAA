# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_09_07_150904) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "castings", force: :cascade do |t|
    t.string "role"
    t.bigint "piece_id", null: false
    t.bigint "member_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "photo"
    t.index ["member_id"], name: "index_castings_on_member_id"
    t.index ["piece_id"], name: "index_castings_on_piece_id"
  end

  create_table "members", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.integer "age"
    t.text "biography"
    t.string "fonction"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.boolean "active", default: true
    t.index ["slug"], name: "index_members_on_slug", unique: true
  end

  create_table "pieces", force: :cascade do |t|
    t.string "title"
    t.string "auteur"
    t.text "description"
    t.bigint "member_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "year"
    t.string "affiche"
    t.index ["member_id"], name: "index_pieces_on_member_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.text "description"
    t.bigint "piece_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["piece_id"], name: "index_reviews_on_piece_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "castings", "members"
  add_foreign_key "castings", "pieces"
  add_foreign_key "pieces", "members"
  add_foreign_key "reviews", "pieces"
  add_foreign_key "reviews", "users"
end
