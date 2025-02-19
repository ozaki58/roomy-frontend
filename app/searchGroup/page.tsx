"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import groupData from "@/data/publicGroup.json";

export default function GroupSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredGroups = groupData.publicGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // クリック時の処理例: 詳細ページへ遷移する
  const handleThreadClick = (group: typeof groupData.publicGroups[0]) => {
    // 例：/groups/[id] のルートへ遷移
    router.push(`/group/${group.id}`);
  };

  return (
    <div className="p-6">
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white shadow">
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="グループ・チャット・ユーザーを検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <div className="space-y-2">
              {filteredGroups.map(group => (
                // クリック可能にするために onClick と cursor-pointer クラスを追加
                <div
                  key={group.id}
                  onClick={() => handleThreadClick(group)}
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="flex-grow">
                    <h2 className="font-semibold">{group.name}</h2>
                    <p className="text-sm text-gray-500">{group.members} 参加中</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    <span className="sr-only">Join group</span>
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
